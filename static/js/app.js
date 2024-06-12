// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // get the metadata field
    // Filter the metadata for the object with the desired sample number
    // makes sure the sample is an integer
    let metadata = data.metadata.find(row => row.id === parseInt(sample));
    
    // if a metadata record is found, update the panel
    if (metadata){
      // Use d3 to select the panel with id of `#sample-metadata`
      let metaDataPanel = d3.select("#sample-metadata");
      console.log(typeof metadata.id);
      console.log(typeof sample);

      // Use `.html("") to clear any existing metadata
      metaDataPanel.html("");

      // Inside a loop, you will need to use d3 to append new
      // tags for each key-value in the filtered metadata.
      Object.entries(metadata).forEach(([key, value]) => {
        metaDataPanel.append("p").text(`${key}: ${value}`);
      });
    // if no metadata record is found, log error to the console
    } else {
      console.log(`Metadata not found for sample ID: ${sample}`);
    }
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Filter the samples for the object with the desired sample number
    let sampleField = data.samples.find(row => row.id === sample);

    // Get the otu_ids, otu_labels, and sample_values
    let otuIds = sampleField.otu_ids;
    let otuLabels = sampleField.otu_labels;
    let sampleValues = sampleField.sample_values;

    // Build a Bubble Chart
    //creates a trace for the bubble chart
    let bubbleTrace = {
      x: otuIds,
      y: sampleValues,
      mode: 'markers',
      text: otuLabels,
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: "earth"
      }
    };
    // puts trace object into an array
    let bubbleData = [bubbleTrace];
    
    //creates a layout for the bubble chart
    let bubbleLayout = {
      title: 'Bacteria Cultures per Sample',
      xaxis: {title: 'OTU ID'},
      yaxis: {title: 'Number of Bacteria'},
      showlegend: false
    };

    // Render the Bubble Chart
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks

    let mappedIds = otuIds.map(function(item){
      return `OTU ${item}`;
    });

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    
    // creates a trace object
    let trace1 = {
      x: sampleValues.slice(0,10).reverse(),
      y: mappedIds.slice(0, 10).reverse(),
      text: otuLabels,
      type: 'bar',
      orientation: 'h'

    };

    // puts the trace object into an array
    let barData = [trace1];

    // creates layout guidelines for the bar chart
    let barLayout = {
      title: "Top 10 Bacteria Cultures Found in Sample",
      xaxis: {title: 'Number of Bacteria'}
    };

    // Render the Bar Chart
    Plotly.newPlot('bar', barData, barLayout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.

    //initializes the list of names 
    let nameList = [];


    // for loop that iterates through the names in the data and adds them to a new list
    for (let i = 0; i < data.names.length; i++) {
      let name = data.names[i];
      nameList.push(name);
    };

    // iterates through the names in nameList and adds them to the dropdown as options
    nameList.forEach(name => {
      dropdown.append("option")
      .text(name)
      .attr("value", name);
    });

    // Get the first sample from the list
    let firstSample = nameList[0];

    // Build charts and metadata panel with the first sample
    buildMetadata(firstSample);
    buildCharts(firstSample);
    
    
    // does this grab the sample value to pass it in?
    //let sampleInfo = dropdown.property("value");
    //called if a change occurs
    d3.selectAll("#selDataset").on("change", function() {
      let newSample = d3.select(this).property("value");
      optionChanged(newSample);
    });
  });

}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  // calls buildMetada function when sample is changed
  buildMetadata(newSample);
  // calls buildCharts function when sample is changed
  buildCharts(newSample);
}

// Initialize the dashboard
init();
