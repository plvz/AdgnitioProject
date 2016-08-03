//Classes
function NewVolume(id, oldVol, newVol) {
  this.id = id;
  this.oldVol = oldVol;
  this.newVol = newVol;
}

var readCSV = require('nodecsv').readCSV;
var path = "CSV/NewVolumes.csv";
var path2 = "CSV/ListCat.csv";


var ArrayList = require("arraylist");
var id = "";
var oldVol = "";
var newVol = "";

//for category reading
var cat_id;
var category = "";

var l; //new Volume class variable initialize

var ListNewVolume = new ArrayList;
var ListCategory = new ArrayList;
var ListFinalCategory = new ArrayList;


module.exports =
{
  getobj:function Visu(callback)
  {
    readCSV(path, function(error, data) //load newVolume file
    {
      ListNewVolume = []; //clear previous data
      ListFinalCategory = []; //clear previous data
      for(var i = 0; i < data.length-1; i++) // we don't get the last row
      {
        id = data[i][0];
        oldVol = data[i][2];
        newVol = data[i][3];

        l = new NewVolume(id, oldVol, newVol);
        ListNewVolume.push([l.id, l.oldVol, l.newVol]);
      }

      //read category
      readCSV(path2, function(error, data2)//load Listcat file
      {
        ListCategory = []; //clear previous data
        for(var j = 0; j < data2.length; j++)
        {
          cat_id = data2[j][0];
          category = data2[j][1];
          ListCategory.push([cat_id, category]);
        }


        //attributes to id's their respective category
        for(var k = 0 ; k < ListNewVolume.length; k++ )
        {
          for(var l = 0 ; l < ListCategory.length; l++)
          {

            if(ListNewVolume[k][0] == ListCategory[l][0])
            {
              ListFinalCategory.push([ListNewVolume[k][0], ListCategory[l][1], ListNewVolume[k][1], ListNewVolume[k][2]]);
            }
          }
        }
        callback(null, ListFinalCategory);
      });
    });
  }

}
