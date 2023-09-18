// Note that decorators you want to use must be imported from NestJS.
import { Injectable } from '@nestjs/common';

// The @Injectable decorator ensures that this service can be injected into other components or services.
@Injectable()
// The 'export' keyword allows an object, function, class, or variable to be accessible and usable in other modules or parts of the program. 
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

// Note for the app.service file: This is where you should handle logic and perform heavy lifting tasks.
