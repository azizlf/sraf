import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { ClientComponent } from './client.component';
import { SettingsComponent } from '../../components/client/settings/settings.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AssistantComponent } from '../../components/client/assistant/assistant.component';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { ConsumerComponent } from '../../components/client/dashbords/consumer/consumer.component';
import { ProviderComponent } from '../../components/client/dashbords/provider/provider.component';
import { OperatorComponent } from '../../components/client/dashbords/operator/operator.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    ClientComponent,
    SettingsComponent,
    AssistantComponent,
    ConsumerComponent,
    ProviderComponent,
    OperatorComponent
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatMenuModule,
    HttpClientModule
  ]
})
export class ClientModule { }
