//Classes
function OldVolume(id, country, Vol) {
  this.id = id;
  this.country = country;
  this.Vol = Vol;
}

function NewVolume(id, country, Vol) {
  this.id = id;
  this.country = country;
  this.Vol = Vol;
}

function SUMOld(sum)
{
  this.sum = sum;
}

function SUM(sum)
{
  this.sum = sum;
}

function SUMVolCat(sum)
{
  this.sum = sum;
}



var readCSV = require('nodecsv').readCSV;
var path = "Volumes/old/volume/part-00000";
var path2 = "Volumes/new/volume/part-00000";
var path3 = "CSV/ListCat.csv";
var path4 = "CSV/mapIsoCode.csv";



var ArrayList = require("arraylist");
var id = "";
var oldVol = "";
var newVol = "";

//for category reading
var cat_id = "";
var category = "";

var o; //old Volume class variable initialize
var n; //new Volume class variable initialize

var ListOldVolume = new ArrayList;
var ListDistinctOldid = new ArrayList;
var ListDistinctOld = new ArrayList;
var ListNewVolume = new ArrayList;
var ListDistinctNewid = new ArrayList;
var ListDistinctNew = new ArrayList;

var ListPreHisto = new ArrayList;
var ListHisto = new ArrayList;
var ListPreCategory = new ArrayList;
var ListCategoryId = new ArrayList;
var ListCategoryCategory = new ArrayList;
var ListCategory = new ArrayList;

var tabSum1 = [];
function AdSumOld(sum)
{
  var s = new SUMOld(sum);
  tabSum1.push([s.sum]);
}

var tabSum = [];
function AdSum(sum)
{
  var s = new SUM(sum);
  tabSum.push([s.sum]);
}

var tabSumVolCat = [];
function AdSumVolCat(sum)
{
  var s = new SUMVolCat(sum);
  tabSumVolCat.push([s.sum]);
}



module.exports =
{
  getobj:function Visu(callback)
  {
    readCSV(path, function(error, data) //load oldVolume file
    {
      ListOldVolume = []; //clear previous data
      ListDistinctOldid = [];
      ListDistinctOld = [];

      for(var i = 1; i < data.length; i++) // we don't get the first row
      {

        id = data[i][0];
        country = data[i][1];
        newVol = data[i][2];

        o = new NewVolume(id, country, newVol);
        ListOldVolume.push([o.id, o.country, o.Vol]);
      }


      var temp1 = [];
      var unique1 = [];

      for(var ya = 0; ya < ListOldVolume.length; ya++)
      {
        temp1[ListOldVolume[ya][0]] = true; //exclusion doublon
      }

      //get unique id
      for(var ka in temp1)
      {
        unique1.push(ka);
        unique1.sort();
      }
      //console.log(unique1);

      var sum21 = 0;
      var tablast1 = [];
      for(var yoa = 0; yoa < unique1.length; yoa++)
      {
        for(var yooa = 0; yooa < ListOldVolume.length; yooa++)
        {
          if(ListOldVolume[yooa][0] == unique1[yoa])
          {
            sum21 += parseInt(ListOldVolume[yooa][2]);
          }
        }
        AdSumOld(sum21); //get volume of each id but already summed
      }
      //console.log(tabSum1);

      //we need to have correct volume for each id
      var temp21 = [];
      var tabdef1 = [];

      //copy of tabSum in order to calcutate the correct volume
      for(var qa=0; qa < tabSum1.length; qa++)
      {
        temp21.push(tabSum1[qa]);
      }
      //console.log(temp21);

      //exact volume
      for(var q1a=0; q1a < tabSum1.length; q1a++)
      {
        temp21[q1a] = parseInt(temp21[q1a]);

        if(q1a > 0) //exclude first row
        {
          temp21[q1a] = parseInt(temp21[q1a]) - parseInt(tabSum1[q1a-1]);
        }
      }
      //console.log(temp21);

      //add list
      for(var fa=0; fa < unique1.length; fa++)
      {
        ListDistinctOld.push([unique1[fa], temp21[fa]]);
      }
      //console.log(ListDistinctOld);

      //Load New Volume
      readCSV(path2, function(error, data2)
      {
        ListNewVolume = [];
        ListDistinctNewid = [];
        ListDistinctNew = [];

        for(var x = 1; x < data2.length; x++) // we don't get the first row
        {

          id = data2[x][0];
          country = data2[x][1];
          newVol = data2[x][2];

          n = new NewVolume(id, country, newVol);
          ListNewVolume.push([n.id, n.country, n.Vol]);
        }


        var temp = [];
        var unique = [];

        for(var y = 0; y < ListNewVolume.length; y++)
        {
          temp[ListNewVolume[y][0]] = true; //exclusion doublon
        }

        //get unique id
        for(var k in temp)
        {
          unique.push(k);
          unique.sort();
        }

        var sum2 = 0;
        var tablast = [];
        for(var yo = 0; yo < unique.length; yo++)
        {
          for(var yoo = 0; yoo < ListNewVolume.length; yoo++)
          {
            if(ListNewVolume[yoo][0] == unique[yo])
            {
              sum2 += parseInt(ListNewVolume[yoo][2]);
            }
          }
          AdSum(sum2); //get volume of each id but already summed
        }

        //we need to have correct volume for each id
        var temp2 = [];
        var tabdef = [];

        //copy of tabSum in order to calcutate the correct volume
        for(var q=0; q < tabSum.length; q++)
        {
          temp2.push(tabSum[q]);
        }

        //exact volume
        for(var q1=0; q1 < tabSum.length; q1++)
        {
          temp2[q1] = parseInt(temp2[q1]);

          if(q1 > 0) //exclude first row
          {
            temp2[q1] = parseInt(temp2[q1]) - parseInt(tabSum[q1-1]);
          }
        }

        //add list
        for(var f=0; f < unique.length; f++)
        {
          ListDistinctNew.push([unique[f], temp2[f]]);
        }


        //Load Category
        ListCategory = [];
        readCSV(path3, function(error, data3)
        {
          for(var c = 0; c < data3.length; c++) //Retrieve categories
          {
            cat_id = data3[c][0];
            category = data3[c][1];
            ListPreCategory.push([cat_id, category]); //List of categories data that will be distincted
          }

          ListPreHisto = [];
          //Retrieve category_id, old and new volume
          for(var k = 0; k < ListDistinctOld.length; k++)
          {
            for(var m = 0; m < ListDistinctNew.length; m++)
            {
              if(ListDistinctOld[k][0] == ListDistinctNew[m][0])
              {
                  ListPreHisto.push([ListDistinctOld[k][0], ListDistinctOld[k][1], ListDistinctNew[m][1]]); //Retrieve old and new volume for each category_ID
                  ListPreHisto.sort();
              }

            }
          }

          ListHisto = [];
          //Retrieve category_ID and category
          for(var f = 0; f < ListPreCategory.length; f++)
          {
            if(ListCategoryId.indexOf(ListPreCategory[f][0]) ==-1) //distinct method category_ID
            {
              ListCategoryId.push(ListPreCategory[f][0]);

              if(ListCategoryCategory.indexOf(ListPreCategory[f][1]) ==-1) //distinct method category
              {
                ListCategoryCategory.push(ListPreCategory[f][1]);
                ListCategory.push([ListPreCategory[f][0], ListPreCategory[f][1]]); //List of distincted category_ID and category that will be used
              }
            }

          }

          //add info for table
          for(var g = 0; g < ListCategory.length; g++)
          {
            for(var h = 0; h < ListPreHisto.length; h++)
            {
              if(ListCategory[g][0] == ListPreHisto[h][0])
              {
                  var diff = ListPreHisto[h][2] - ListPreHisto[h][1];
                  ListHisto.push([ListCategory[g][0], ListCategory[g][1], ListPreHisto[h][1], ListPreHisto[h][2], diff]); //Retrieve category_ID, category, old Volume, New Volume
                  //ListHisto.push([ListPreHisto[h][0], ListPreHisto[h][1], ListPreHisto[h][2]]);
                  ListHisto.sort();
              }

            }

          }





          //mapListISOcode
          ListMap = [];
          readCSV(path4, function(error, data4)
          {
            //console.log(ListNewVolume);
            for(var ma=0; ma < data4.length; ma++)
            {
              for(var na=0; na < ListNewVolume.length; na++)
              {
                if(ListNewVolume[na][1] == data4[ma][2])
                {
                  //console.log(ListNewVolume[na][0], data4[ma][1], ListNewVolume[na][2]);
                  ListMap.push([ListNewVolume[na][0], data4[ma][1], ListNewVolume[na][2]]);
                }
              }
            }


            var tempCat = [];
            var uniqueCat = [];
            ListVolCat = [];

            for(var listCa = 0; listCa < ListMap.length; listCa++)
            {
              tempCat[ListMap[listCa][1]] = true; //exclusion doublon
            }

            //get unique cat and copy it
            for(var k in tempCat)
            {
              uniqueCat.push(k);
              uniqueCat.sort();
            }

            var sumVolCat = 0;
            //var tablast = [];
            for(var yo = 0; yo < uniqueCat.length; yo++)
            {
              for(var yoo = 0; yoo < ListMap.length; yoo++)
              {
                if(ListMap[yoo][1] == uniqueCat[yo])
                {
                  sumVolCat += parseInt(ListMap[yoo][2]);
                }
              }
              AdSumVolCat(sumVolCat); //get volume of each id but already summed
            }

            //we need to have correct volume for each id
            var tempCat2 = [];
            var tabdefCat = [];

            //copy of tabSum in order to calcutate the correct volume
            for(var q=0; q < tabSumVolCat.length; q++)
            {
              tempCat2.push(tabSumVolCat[q]);
            }

            //exact volume
            for(var q1=0; q1 < tabSumVolCat.length; q1++)
            {
              tempCat2[q1] = parseInt(tempCat2[q1]);

              if(q1 > 0) //exclude first row
              {
                tempCat2[q1] = parseInt(tempCat2[q1]) - parseInt(tabSumVolCat[q1-1]);
              }
            }

            //add list
            for(var f=0; f < uniqueCat.length; f++)
            {
              ListVolCat.push([uniqueCat[f], tempCat2[f]]);
            }

            ListVolCat.sort();
            ListMap.sort();

            //console.log(ListVolCat.length);

            //console.log(ListMap);
            ListSend = [];
            ListSend.push([ListHisto], [ListOldVolume], [ListNewVolume], [ListMap], [ListVolCat]);

            //console.log(ListSend[0][0]);
            callback(null, ListSend);

          });



        });

      });

    });

  }
}
