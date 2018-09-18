import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './app-sidebar.component.html'
})
export class AppSidebarComponent {

  public mouseleave() {
    document.querySelector('body').classList.add('sidebar-minimized');
    // document.querySelector('body').classList.add('brand-minimized');
  }

  public mouseenter() {
    document.querySelector('body').classList.remove('sidebar-minimized');
    // document.querySelector('body').classList.remove('brand-minimized');
  }
}
