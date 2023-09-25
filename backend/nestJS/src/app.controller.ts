// This import line is used to include content from other files.
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// Handles all incoming requests without filtering, so all your-domain.com/ requests.
// Adding something into the brackets like ('games') will handle only your-domain.com/games requests.
@Controller()
export class AppController {
  // In this context, 'appService' is the argument name, and 'AppService' is the type of that argument.
  constructor(private readonly appService: AppService) {}

  // This @Get decorator, trigger the method only when the path is empty due to the empty brackets.
  // If something is specified then it will trigger only if the specified item is present in the path.
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

// In the app.controller.ts file, define routes, handle incoming HTTP requests, and assemble responses.
