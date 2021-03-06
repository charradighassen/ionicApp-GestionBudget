
import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import { GoalItem } from '../../models/goalItem/goalItem';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class GoalServiceProvider {


  userId: any;
  goalsList : Observable<GoalItem[]>;
  constructor(public db:AngularFireDatabase,private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(user => {
      if(user) this.userId = user.uid
    })
  }
  getGoalsItems(){
    if(!this.userId) return;
    return this.db.list<GoalItem>('goals/'+ this.userId+'/');
  }

   addItem(GoalItem){
    return this.db.list<GoalItem>('goals/'+ this.userId+'/').push({
      name : GoalItem.name,
      description : GoalItem.description,
      startDate : GoalItem.startDate,
      endDate : GoalItem.endDate,
      color:GoalItem.color,
      userId : this.userId
    });
  }

  remouveItem(id){
    return this.db.list<GoalItem>('goals/'+ this.userId+'/').remove(id);
  }

}
