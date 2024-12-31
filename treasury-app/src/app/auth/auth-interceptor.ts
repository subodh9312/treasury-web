import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpXsrfTokenExtractor } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { exhaustMap, take } from 'rxjs/operators';
import { AuthService } from "./auth.service";
import { Observable } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private tokenExtractor: HttpXsrfTokenExtractor) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const cookieheaderName = 'X-XSRF-TOKEN';
    let csrfToken = this.tokenExtractor.getToken() as string;
    if (csrfToken !== null && !req.headers.has(cookieheaderName)) {
      req = req.clone({ headers: req.headers.set(cookieheaderName, csrfToken) });
    }

    req = req.clone( { withCredentials:  true });

    if (req.url.substring(req.url.lastIndexOf('/') + 1) === 'login') {
      return next.handle(req);
    }
    if (this.authService.getToken()) {
      return next.handle(this.generateAuthRequest(req));
    }
    return this.authService.getAuthStatusListener().pipe(take(1), exhaustMap(isAuthenticated => {
      return next.handle(this.generateAuthRequest(req));
    }));
  }

  generateAuthRequest(req: HttpRequest<any>) {
    const token = this.authService.getToken();
    const authRequest = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + token)
    });
    return authRequest;
  }

  
}
