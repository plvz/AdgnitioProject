//JQuery

//execute function while page is loaded
$(document).ready(function()
{
  setTimeout(function(){$(".loading").hide();}, 1000);

  $('#input-tab').keyup(function() //take value from searchbar
  {
    searchTable1($(this).val()); //search this value in the table
  });

  $('#input-tab2').keyup(function() //take value from searchbar
  {
    $(".loading").show();
    searchTable2($(this).val()); //search this value in the table
  });

  $('#input-tab3').keyup(function() //take value from searchbar
  {
    $(".loading").show();
    searchTable3($(this).val()); //search this value in the table
  });
  //$(".loading").hide();
});


function searchTable1(inputVal)
{
  var table = $('#donnee'); //table id

  table.find('tr').each(function(index, row) //retrieve tr from table
  {
    var allCells = $(row).find('td'); //find td
    if(allCells.length > 0)
    {

      var found = false; //set false as default for not found
      allCells.each(function(index, td)
      {
        var regExp = new RegExp(inputVal, 'i'); //use regular expression to search; i=case insensitive match
        if(regExp.test($(td).text())) //if expression typed is contained in td fields
        {
          found = true; //set status true when it's found
          return false; //end browsing
        }
      });

      //check status and define the behaviour
      if(found == true)
      {
        $(row).show(); //show result
      }
      else
      {
        //$(".loading").show();
        $(row).hide(); //hide other content
      }

    }


  });
  //setTimeout(function(){$(".loading").hide()}, 1000);
}


function searchTable2(inputVal)
{
  var table = $('#donnee2'); //table id

  table.find('tr').each(function(index, row) //retrieve tr from table
  {
    var allCells = $(row).find('td'); //find td
    if(allCells.length > 0)
    {
      var found = false; //set false as default for not found
      allCells.each(function(index, td)
      {
        var regExp = new RegExp(inputVal, 'i'); //use regular expression to search; i=case insensitive match
        if(regExp.test($(td).text())) //if expression typed is contained in td fields
        {
          found = true; //set status true when it's found
          return false; //end browsing
        }
      });

      //check status and define the behaviour
      if(found == true)
      {
        $(row).show(); //show result
      }
      else
      {

        $(row).hide(); //hide other content
      }
    }
  });
  setTimeout(function(){$(".loading").hide()}, 1000);
}

function searchTable3(inputVal)
{
  var table = $('#donnee3'); //table id

  table.find('tr').each(function(index, row) //retrieve tr from table
  {
    var allCells = $(row).find('td'); //find td
    if(allCells.length > 0)
    {
      var found = false; //set false as default for not found
      allCells.each(function(index, td)
      {
        var regExp = new RegExp(inputVal, 'i'); //use regular expression to search; i=case insensitive match
        if(regExp.test($(td).text())) //if expression typed is contained in td fields
        {
          found = true; //set status true when it's found
          return false; //end browsing
        }
      });

      //check status and define the behaviour
      if(found == true)
      {
        $(row).show(); //show result
      }
      else
      {

        $(row).hide(); //hide other content
      }
    }
  });
  setTimeout(function(){$(".loading").hide()}, 1000);
}
