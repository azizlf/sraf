import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientComponent } from './client.component';
import { SettingsComponent } from 'src/app/components/client/settings/settings.component';
import { AssistantComponent } from 'src/app/components/client/assistant/assistant.component';
import { ConsumerComponent } from 'src/app/components/client/dashbords/consumer/consumer.component';
import { ProviderComponent } from 'src/app/components/client/dashbords/provider/provider.component';
import { OperatorComponent } from 'src/app/components/client/dashbords/operator/operator.component';
import { DataSService } from 'src/app/services/data-s.service';


const routes: Routes = [
  {
    path: '',
    component: ClientComponent,
    children: [
      {
        path: 'operator-dashbord',
        component: OperatorComponent
      },
      {
        path: 'provider-dashbord',
        component: ProviderComponent
      },
      {
        path: 'consumer-dashbord',
        component: ConsumerComponent
      },
      {
        path: 'settings',
        component: SettingsComponent
      },
      {
        path: 'assistant',
        component: AssistantComponent
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
