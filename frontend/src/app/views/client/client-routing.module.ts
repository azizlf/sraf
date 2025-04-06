import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientComponent } from './client.component';
import { DashbordComponent } from 'src/app/components/client/dashbord/dashbord.component';
import { SettingsComponent } from 'src/app/components/client/settings/settings.component';
import { AssistantComponent } from 'src/app/components/client/assistant/assistant.component';

const routes: Routes = [
  {
    path: '',
    component: ClientComponent,
    children: [
      {
        path: '',
        component: DashbordComponent
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
