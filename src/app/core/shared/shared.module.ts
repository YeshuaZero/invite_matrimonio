import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { LoaderComponent } from '../loader/loader.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableComponent } from '../table/table.component';
import { CapitalizePipe } from '../pipes/capitalize';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SafeUrlPipe } from '../pipes/safeUrl';

@NgModule({
  declarations: [
    CapitalizePipe,
    SafeUrlPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule.forChild({}),
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    NgOptimizedImage,
    MatTooltipModule,
    LoaderComponent,
    TableComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    NgOptimizedImage,
    MatTooltipModule,
    LoaderComponent,
    TableComponent,
    CapitalizePipe,
    SafeUrlPipe
  ],
  providers: []
})
export class SharedModule { }
