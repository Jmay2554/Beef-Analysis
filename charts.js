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
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    //need to call in the metadata array in order to grab the wfreq
    var metadata = data.metadata

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleArray = samples.filter(sampleObj => sampleObj.id == sample);
    // Create a variable that filters the metadata array
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);

  

    //  5. Create a variable that holds the first sample in the array.
    var sampleResult = sampleArray[0]
    var result = resultArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIDs  = sampleResult.otu_ids
    var otuLabels = sampleResult.otu_labels
    var sampleValues = sampleResult.sample_values
    var wfreq = result.wfreq
    var wfreqFloat = parseFloat(wfreq)
  

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    //create a sorted IDs value
    var sortedOtuIDs = otuIDs.sort((a,b) => a.sampleValues - b.sampleValues).slice(0,10).reverse()
    //convert that value toa string
    var  yticks = sortedOtuIDs.map(function(item){
      return "OTU " + item.valueOf(String)
    })
    //slice and reverse our SV's
    var values = sampleValues.slice(0,10).reverse()
    //Grab the top 10 Labels
    var Labels = otuLabels.slice(0,10).reverse()
    // 8. Create the trace for the bar chart. 
    var barData = {x:values,
      y:yticks,
      type:"bar",
      orientation:"h",
      hovertemplate:Labels
    }
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title:"Top 10 Bacteria Cultures Found"
    };
    //Create the bubble chart information
    var bubbleData = {
      x:otuIDs,
      y:sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        color: otuIDs,
        size: sampleValues,
        sizeref: 2
      }
    }
    //create the bubble layout
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title:"OTU ID"},
      height:500,
      width: 1000

    }
    //create the guageData

    var gaugeData = { value:wfreqFloat,
      title: { text: "Belly Button Washing Frequency",
             },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis:{ range:[0,10]},
        steps:[ {range:[0,2], color:"lightgray"},
                { range:[2,4], color:"gray"},
                {range:[4,6], color:"blue"},
                {range:[6,8], color:"red"},
                {range:[8,10], color:"green"}
              ],
            
        bar: { color:"black"}
      },
     }
    var gaugeLayout = {
      width: 500,
      height: 400,
      margin: { t: 25, r: 25, l: 25, b: 25 },
      paper_bgcolor: "white",
      font: { color: "black", family: "Arial" 
    }}
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bubble",[bubbleData], bubbleLayout);
    Plotly.newPlot("bar",[barData], barLayout);
    Plotly.newPlot("gauge",[gaugeData], gaugeLayout)
  });
}
