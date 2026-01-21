import { bootstrapApplication } from '@angular/platform-browser';
import { config } from './app/app.config.server';
import { App } from './app/app';

// Casting the function to 'any' allows passing the 3rd argument
// while typings are catching up in version 20.3.16
const bootstrap = (context: any) => 
  (bootstrapApplication as any)(App, config, context);

export default bootstrap;
