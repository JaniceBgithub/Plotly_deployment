function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      //console.log(value)
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file   
  d3.json("samples.json").then(function(data) {
     var information = data.samples;
    // Filter the data for the object with the desired sample number, used for all charts
    var resultArray2 = information.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray2[0];

    //bubble chart
      var trace = {
      x: result.otu_ids,
      y: result.sample_values,
      mode: 'markers',
      marker: {
        size: result.sample_values,
        color: result.otu_ids,
        colorscale: 'icefire',
      },
      text: result.otu_labels
    };
      var data1 = [trace];
      var layout = {
        title: "<b>Bubble Chart of Belly Button Bacteria</b>",
        showlegend: false,
        xaxis: {
          title: "Bacteria ID"
        },
        yaxis: {
          title: "Sample Value"
        },
        height: 600,
        width: 1000
      };
  
      Plotly.newPlot("bubble", data1, layout);


      //bar chart
       // create an array that holds the information 
      var array = [];

      var otuid = result.otu_ids;
      var otulabel = result.otu_labels;
      var samplelevalues = result.sample_values;
      array = [{"otu_id": otuid, 
                "otu_label": otulabel,
                "sample_values": samplelevalues
                }];
      
      //sort the array2 
      array2 = array.sort((a,b) => parseInt(b.sample_values)-parseInt(a.sample_values));
      //get the slices for 10 elements & then reverse order
      var otu_id_2 = array2[0].otu_id.slice(0,10).reverse();
      var otu_label_2 = array2[0].otu_label.slice(0,10).reverse();     
      var sample_values_2 = array2[0].sample_values.slice(0,10).reverse(); 
             
      var trace8 = {
       x: sample_values_2,
       y: (otu_id_2),
      hovertext: array2.slice(0,10).map(record => "(" + record.otu_id_2 + ", " + record.otu_label_2 + ")"),
        type: "bar",
       orientation: "h"
        };
       //y axis is categorical so the IDs just show up as is
        var layout2 = {
          title: "<b>Bar Chart of Belly Button Bacteria</b>",
          showlegend: false,
          xaxis: {
            title: "Bacteria Count"
          },
          yaxis: {
            title: "Bacteria ID",
            type: 'category'
          },

          height: 600,
          width: 1000
        };

      var data8 =[trace8]

      Plotly.newPlot('bar_chart', data8, layout2);

      //gauge chart, use metadata part of the samples.json
      // 2. Use d3.json to load and retrieve the samples.json file   
      d3.json("samples.json").then(function(data) {
      var information2 = data.metadata;
 
      // Filter the data for the object with the desired sample number, used for all charts
      var resultArray3 = [];
      var resultArray3 = information2.filter(sampleObj => sampleObj.id == sample)[0];

      var wash_freq = resultArray3.wfreq;
   

    var data5 = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: wash_freq,
        title: { text: "Belly Button Scrubs Per Week" },
        type: "indicator",
        mode: "gauge+number",
        
        gauge: {
          axis: { range: [null, 10], tickwidth: 2, tickcolor: "darkblue" },
          bar: { color: "black" },
          bgcolor: "white",
          borderwidth: 2,
          bordercolor: "gray",
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4,6], color: 'yellow'},
            { range: [6,8], color: 'lightgreen'},
            { range: [8,10], color: 'green'},
          ]
          }
      }
    ];
    
    var layout5 = { width: 1000, height: 500, margin: { t: 0, b: 0 } };

    Plotly.newPlot('gauge', data5, layout5);


   
       })

     

   



  
      }
      
    )
    };