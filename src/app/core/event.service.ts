import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private eventSource!: EventSource;
  private eventSubject = new BehaviorSubject<any>(null);
  public events = this.eventSubject.asObservable();

  constructor(private zone: NgZone) { }

  getServerSentEvent(url: string): Observable<any> {
    return Observable.create((observer: any) => {
      if (!this.eventSource) {
        this.eventSource = this.getEventSource(url);
      }
      
      this.eventSource.onmessage = event => {
        this.zone.run(() => {
           observer.next(event);           
        });
      };

      this.eventSource.addEventListener('CHAMADO_CRIADO', event => {
        this.zone.run(() => {
          this.eventSubject.next(event);
        })
      })

      this.eventSource.addEventListener('CHAMADO_PROCESSANDO', event => {
        this.zone.run(() => {
          this.eventSubject.next(event);
        })
      })

      this.eventSource.addEventListener('CHAMADO_FINALIZADO', event => {
        this.zone.run(() => {
          this.eventSubject.next(event);
        })
      })
      
      this.eventSource.onerror = error => {
        this.zone.run(() => {
          observer.error(error);
        });
      };
    });
  }

  private getEventSource(url: string): EventSource {
    return new EventSource(url);
  }
}
