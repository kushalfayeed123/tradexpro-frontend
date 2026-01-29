import { State, Action, StateContext, Selector } from '@ngxs/store';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { inject, Inject, Injectable } from '@angular/core';
import { KycService } from '../../../core/services/kyc.service';
import { GetUserKyc, InitiateKyc, SubmitKycDocument, ViewKycDocument } from './kyc.actions';
import { of } from 'rxjs';
import { SetLoading } from '../../../auth/state/auth.actions';


export interface KycStateModel {
    record: any | null;
    loading: boolean;
}

@State<KycStateModel>({
    name: 'kyc',
    defaults: { record: null, loading: false }
})
@Injectable()
export class KycState {
    private kycService = inject(KycService)

    @Selector()
    static getKycRecord(state: KycStateModel) { return state.record; }

    @Selector()
    static loading(state: KycStateModel) { return state.loading; }

    @Action(GetUserKyc)
    getUserKyc(ctx: StateContext<KycStateModel>) {
        ctx.patchState({ loading: true });
        return this.kycService.getUserKyc().pipe(
            tap((record) => ctx.patchState({ record, loading: false }))
        );
    }

    @Action(InitiateKyc)
    initiateKyc(ctx: StateContext<KycStateModel>, action: InitiateKyc) {
        return this.kycService.initiateKyc(action.level).pipe(
            tap((newRecord) => ctx.patchState({ record: newRecord }))
        );
    }

    @Action(SubmitKycDocument)
    submitKycDocument(ctx: StateContext<KycStateModel>, action: SubmitKycDocument) {
        ctx.dispatch(new SetLoading(true));

        ctx.patchState({ loading: true });
        const state = ctx.getState();
        const currentKyc = state.record;

        // UI Calculation: If no data, target is 1. If data exists, target is current + 1.
        const targetLevel = currentKyc ? Number(currentKyc.level) + 1 : 1;

        // Use existing draft if it exists and matches the target level
        const initiate$ = (currentKyc && currentKyc.status === 'draft')
            ? of(currentKyc)
            : this.kycService.initiateKyc(targetLevel);

        return initiate$.pipe(
            switchMap((kycRecord) => {
                return this.kycService.uploadDocument(kycRecord.id, action.file).pipe(
                    switchMap((uploadRes) => {
                        const payload = {
                            kyc_id: kycRecord.id,
                            level: targetLevel,
                            documents: [{
                                document_type: action.docType, // Passed from UI selection
                                document_url: uploadRes.path,
                                document_number: 'REF-' + Math.random().toString(36).toUpperCase().substring(7)
                            }]
                        };
                        return this.kycService.submitKyc(payload);
                    })
                );
            }),
            tap(() => {
                ctx.dispatch(new SetLoading(false));

                ctx.patchState({ loading: false });
                ctx.dispatch(new GetUserKyc());
            }),
            catchError((err) => {
                ctx.dispatch(new SetLoading(false));

                ctx.patchState({ loading: false });
                throw err;
            })

        );
    }

    @Action(ViewKycDocument)
    viewDocument(ctx: StateContext<KycStateModel>, action: ViewKycDocument) {
        return this.kycService.getKycDocument(action.path).pipe(
            tap((res: any) => {
                if (res?.url) {
                    window.open(res.url, '_blank');
                }
            })
        );
    }
}