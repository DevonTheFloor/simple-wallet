import { BrowseViewModel } from './browse-view-model';
import Sqlite from "nativescript-sqlite";
import { Application } from '@nativescript/core';

export function onNavigatingTo(args) {
  const component = args.object;
  component.bindingContext = new BrowseViewModel();


  const db = new Sqlite("MyTable");
  /*db.then((db) => {
    db.execSQL("CREATE TABLE IF NOT EXISTS MyTable (id INTEGER PRIMARY KEY AUTOINCREMENT, word TEXT)");
      db.execSQL("insert into MyTable (word) values (?)", ["Hi"])
          .then((id) => {
              console.log("The new record id is:", id);
          }, (error) => {
              console.log("INSERT ERROR", error);
          });
  }, error => {
      console.log("OPEN DB ERROR", error);
  });*/
  db.
    then((res)=>{
      res.get('select * from MyTable where id > ? and id < ?', [1,100], function(err, resultSet) {
        console.log("Result set is:", resultSet); // Prints [["Row_1 Field_1" "Row_1 Field_2",...], ["Row 2"...], ...]
    })  
  });
  db.
    then((res)=>{
      res.all('select * from MyTable', function(err, result) {
        console.log("All:", result); // Prints [["Row_1 Field_1" "Row_1 Field_2",...], ["Row 2"...], ...]
    })  
  });
  const adition = component.getViewById("adition"),
    soustraction = component.getViewById("soustraction"),
    laDate = component.getViewById('la-date'),
    reste = component.getViewById('reste');
  adition.on("tap", function() {
    const toadd = component.getViewById('montant').text;
    console.log('montant avant if: ', toadd);
    console.log('type: ', typeof(toadd))
    if(toadd === '') {
      alert("Vous n'avez pas indiqué de montant");
    } else {
      try {
        db
        .then((tab)=>{
          tab.execSQL("insert into MyTable (word) values (?)", ["Enfin"])
          .then((id) => {
              console.log("The new record id is:", id);
          }, (error) => {
              console.log("INSERT ERROR", error);
          });
        })
       } catch {
          alert("Rallumez l'application s'il vous plaît, il y a un problèlme")
        }
      additionMoney(reste, component, 'montant');
    }
  });
  soustraction.on("tap", function() {
    const tosous = component.getViewById('montant').text;
    if(tosous === '') {
      alert("Vous n'avez pas indiqué de montant");
    } else {
      soustractionMoney(reste, component, 'montant');
      try {
        db
        .then((tab)=>{
          tab.execSQL("insert into MyTable (word) values (?)", ["Decidemment"])
          .then((id) => {
              console.log("The new record id is:", id);
          }, (error) => {
              console.log("INSERT ERROR", error);
          });
        })
       } catch {
          alert("Rallumez l'application s'il vous plaît, il y a un problèlme")
        }
    }
});
}

let jpm =[31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
export function returnDate() {
  const date = new Date(),
    year = date.getFullYear(),
    mounth = date.getMonth()+1,
    today = date.getDate(),
    bissextile = isBissextile(year);
  let tomorrow = '';
  let tomorrowMounth = '';
  let tomorrowYear = '';
  let yesterday = '';
  let yesterdayMounth = '';
  let yesterdayYear = '';
  if(bissextile === true ) {
    jpm.splice(1,1,29);
  } 
  if( today === jpm[mounth-1]) {
    tomorrow = 1;
    tomorrowMounth = mounth+1;
    yesterday = today-1;
    yesterdayMounth = mounth;
    yesterdayYear = year;
  } else {
    tomorrow = today +1;
    tomorrowMounth = mounth;
    yesterday = today-1;
    yesterdayMounth = mounth;
    yesterdayYear = year;
  }
  if (today === 31 && mounth === 12) {
    tomorrowYear = year+1;
    yesterdayYear = year;
  } else {
    tomorrowYear = year;
    yesterdayYear = year;
  }
  if (today === 1) {
    yesterday = jpm[mounth-2];
    yesterdayMounth = mounth-1;
  } 
  if(today === 1 && mounth === 1) {
    yesterdayMounth = 12;
    yesterdayYear = year-1;
  }
  return { yesterday, today, tomorrow, mounth, yesterdayMounth, tomorrowMounth, year, yesterdayYear, tomorrowYear}
}

function estDivParQuatre(annee) {
  const div4 = annee%4;
  if(div4 === 0) {
    return true;
  } else {
    return false;
  }
}
function estDivParCent(annee) {
  const div100 = annee%100;
  if(div100 === 0) {
    return true;
  } else {
    return false;
  }
}
function estDivParQuatreCent(annee) {
  const div400 = annee%400;
  if(div400 === 0) {
    return true;
  } else {
    return false;
  }
}
function isBissextile(annee) {
  if ((estDivParQuatre(annee) === true) 
    && (estDivParCent(annee) === true) 
      && (estDivParQuatreCent(annee) === true)) {
    return true;
  } else {
    return false;
  }
}

export function additionMoney(ancien, from, idMontant) {
  console.log('in add money');
  const nouveau = from.getViewById(idMontant),
    result = parseFloat(ancien.text) + parseFloat(nouveau.text);
    console.log('NOUVEAU:', nouveau);
    console.log('ANCIEN:', ancien);
    console.log('RESULt in add :', result);
    ancien.text = result;
    nouveau.text = '';
  return result;
}
export function soustractionMoney(ancien, from, idMontant) {
  console.log('In sous Money');
  const nouveau = from.getViewById(idMontant),
    result = parseFloat(ancien.text) - parseFloat(nouveau.text);
    console.log('NOUVEAU:', nouveau);
    console.log('ANCIEN:', ancien);
    console.log('RESULt in add :', result);
    ancien.text = result;
    nouveau.text = '';
  return result;
}