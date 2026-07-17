import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectReportComponent } from './components/project-report/project-report.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ProjectReportComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'SIA-CT-Frontend';
}
