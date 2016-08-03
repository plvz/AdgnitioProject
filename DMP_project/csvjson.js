//Classes
function App(id, ap, column, weight, methood, table) {
  this.id = id;
  this.ap = ap;
  this.column = column;
  this.weight = weight;
  this.methood= methood;
  this.table = table;
}

function Url(id, ur, column, weight, methood, table) {
  this.id = id;
  this.ur = ur;
  this.column = column;
  this.weight = weight;
  this.methood = methood;
  this.table = table;
}

function Join(id, methood, table, column, joinKey, weight) {
  this.id = id;
  this.methood = methood;
  this.table = table;
  this.column = column;
  this.joinKey = joinKey;
  this.weight = weight;
}

function JSONModelClass(category_ID, methood, table, column, pattern, weight)
{
  this.category_ID = category_ID;
  this.methood = methood;
  this.table = table;
  this.column = column;
  this.pattern = pattern;
  this.weight = weight;
}

function JSONModelClassJoin(category_ID, methood, table, column, joinKey, weight)
{
  this.category_ID = category_ID;
  this.methood = methood;
  this.table = table;
  this.column = column;
  this.joinKey = joinKey;
  this.weight = weight;
}

//csv variables
var readCSV = require('nodecsv').readCSV;
var path = "CSV/app.csv";
var path2 = "CSV/url.csv";
var pathTest = "CSV/TestAll.csv";
var ArrayList = require("arraylist");
var appl = "";
var urrl = "";
var idd = "";
var iddu = "";
var methodd = "patternMatching";
var methodd_join = "join";
var tableapp = "apps";
var tableurl = "history";
var columnapp = "package_name";
var columnurl = "url";
var weiapp = "";
var weiurl = "";
var ListAPP = new ArrayList;
var ListContent = new ArrayList;
var ListURL = new ArrayList;
var Joinlist = new ArrayList;
var join_package_name = "";
var obj = "";

//json file variables
var jsonfile = require('jsonfile');
var file = 'scoring_settings.json';
var listJson = new ArrayList;

//Add Function for APP, URL, JOINKey List
function AddAPP(idd, appl, columnapp, weiapp, methodd, tableapp)
{
  var a = new App(idd, appl, columnapp, weiapp, methodd, tableapp);
  ListAPP.push([a.id, a.ap, a.column, a.weight, a.methood, a.table]);
}

function AddURL(iddu, urrl, columnurl, weiurl, methodd, tableurl)
{
  var u = new Url(iddu, urrl, columnurl, weiurl, methodd, tableurl);
  ListURL.push([u.id, u.ur, u.column, u.weight, u.methood, u.table]);
}

function AddJoin(idd, methodd_join, tableapp, columnapp, join_package_name, weiapp)
{
  var join = new Join(idd, methodd_join, tableapp, columnapp, join_package_name, weiapp);
  Joinlist.push([join.id, join.methood, join.table, join.column, join.joinKey, join.weight]);
}


//Main code
module.exports = //essential to exports the method
{
  getobj:function CSVtoJSON(path) //essential to catch the method
  {
    readCSV(path, function(error, data)
    {
      ListContent = [];
      Joinlist = [];
      ListAPP = [];
      ListURL = [];
      for(var i = 0; i < data.length; i++)
      {
        idd = data[i][0];
        weiapp = parseInt(data[i][3]);

        var firstposition = 0; //string firstposition in order to add character
        var endposition; //string length to be defined on each block


        //ReadURL
        if(data[i][2].substring(0,4) == "http")
        {
            //console.log("ok");
            iddu = data[i][0];
            weiurl = parseInt(data[i][3]);

            urrl = data[i][2].slice(0, data[i][2].lastIndexOf('.'));
            if(urrl.split('.').pop() == "co" || urrl.split('.').pop() == "org" || urrl.split('.').pop() == "go" || urrl.split('.').pop() == "mx" || urrl.split('.').pop() == "com" || urrl.split('.').pop() == "gob" || urrl.split('.').pop() == "att" || urrl.split('.').pop() == "mob" || urrl.split('.').pop() == "rcs" || urrl.split('.').pop() == "gov")
            {
              urrl = urrl.slice(0, urrl.lastIndexOf('.'));
              urrl = urrl.split('.').pop();
              if(urrl == "espn" || urrl == "about")
              {
                urrl = urrl.slice(0, urrl.lastIndexOf('.'));
                urrl = urrl.split('.').pop();

                AddURL(iddu, urrl, columnurl, weiurl, methodd, tableurl);
              }
              //Add characters
              endposition = urrl.length;
              urrl = [urrl.slice(0, endposition), "[^\\w].*$", urrl.slice(endposition)].join(''); // add string at the end
              urrl = [urrl.slice(0, firstposition), "^.*[^\\w]", urrl.slice(firstposition)].join(''); //add string at the begining

              AddURL(iddu, urrl, columnurl, weiurl, methodd, tableurl);
            }
            else
            {
              urrl = urrl.split('.').pop();

              //Add characters
              endposition = urrl.length;
              urrl = [urrl.slice(0, endposition), "[^\\w].*$", urrl.slice(endposition)].join(''); // add string at the end
              urrl = [urrl.slice(0, firstposition), "^.*[^\\w]", urrl.slice(firstposition)].join(''); //add string at the begining

              AddURL(iddu, urrl, columnurl, weiurl, methodd, tableurl);
            }

        }
        else //Read APP
        {
          join_package_name = data[i][2];
          AddJoin(idd, methodd_join, tableapp, columnapp, join_package_name, weiapp);
        }

      }

      //Add ListUrl to ListContent
      for(var y = 0; y < ListURL.length; y++)
      {
        //ListContent.pop();
        ListContent.push([ListURL[y][0], ListURL[y][1], ListURL[y][2], ListURL[y][3], ListURL[y][4], ListURL[y][5]]); //[id][url][column][weight]
      }

      //Sort ListContent by id and app/url
      ListContent.sort();
      Joinlist.sort();

      //JSON writting
      listJson = [];
      for(var l = 0; l < ListContent.length; l++)
      {
        var category_ID = ListContent[l][0];
        var methdd = ListContent[l][4];
        var table = ListContent[l][5];
        var column = ListContent[l][2];
        var pattern = ListContent[l][1];
        var wei = ListContent[l][3];

        var json = new JSONModelClass(category_ID, methdd, table, column, pattern, wei);

        var model =
        {
          "category_ID": json.category_ID,
          "method": json.methood,
          "table": json.table,
          "column": json.column,
          "pattern": json.pattern,
          "weight": json.weight
        }
        //add model to list
        listJson.push(model);


      }

      //joinlist add json
      for(var x = 0; x < Joinlist.length; x++)
      {
        var category_ID = Joinlist[x][0];
        var methdd = Joinlist[x][1];
        var table = Joinlist[x][2];
        var column = Joinlist[x][3];
        var joinkeyy = Joinlist[x][4];
        var wei = Joinlist[x][5];

        var json = new JSONModelClassJoin(category_ID, methdd, table, column, joinkeyy, wei);

        var model2 =
        {
          "category_ID": json.category_ID,
          "method": json.methood,
          "table": json.table,
          "column": json.column,
          "joinKey": json.joinKey,
          "weight": json.weight
        }
        //add model to list
        listJson.push(model2);
      }

      //json model containing all data refering to model
      obj =
      {
        "contributions" : listJson
      }


      console.log(listJson.length);

      //writeFile
      jsonfile.writeFile(file, obj, {spaces : 2}, function (err)
      {
        console.error("done ;)")
      })

    });
  }
}
