// Make constant url for all uses of d3.json
const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';
// Example usage of d3.json to print to console log
d3.json(url).then(function(data){
    console.log(data)
})
// Initial function to begin
function init() {
    // Making dropdown menu
    let dropdownMenu = d3.select("#selDataset");
    d3.json(url).then(function(data) {
        let names = data.names;
        names.forEach((id) => {
            console.log(id);
            // Adds samples to dropdown menu
            dropdownMenu.append("option")
            .text(id)
            .property("value",id);
        });
        let sample_one = names[0];
        console.log(sample_one);
        // Functions for all sections
        startMetadata(sample_one);
        BarChart(sample_one);
        BubbleChart(sample_one);
    })
}
function startMetadata(sample) {
    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {
        // Retrieve all metadata
        let metadata = data.metadata;
        // Filter based on the value of the sample
        let value = metadata.filter(result => result.id == sample);
        // Log the array of metadata objects after the have been filtered
        console.log(value)
        // Get the first index from the array
        let valueData = value[0];
        // Clear out metadata
        d3.select("#sample-metadata").html("");
        // Use Object.entries to add each key/value pair to the panel
        Object.entries(valueData).forEach(([key,value]) => {
            // Log the individual key/value pairs as they are being appended to the metadata panel
            console.log(key,value);
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });
};
function BarChart(sample) {
    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {
        // Retrieve all sample data
        let sampleInfo = data.samples;
        // Filter based on the value of the sample
        let value = sampleInfo.filter(result => result.id == sample);
        // Get the first index from the array
        let valueData = value[0];
        // Get the otu_ids, lables, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;
        // Log the data to the console
        console.log(otu_ids,otu_labels,sample_values);
        // Set top ten items to display in descending order
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();
        // Set up the trace for the bar chart
        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };
        // Setup the layout
        let layout = {
            title: "Top 10 OTUs Present"
        };
        // Call Plotly to plot the bar chart
        Plotly.newPlot("bar", [trace], layout)
    });
};
// Function that builds the bubble chart
function BubbleChart(sample) {
    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {
        // Retrieve all sample data
        let sampleInfo = data.samples;
        // Filter based on the value of the sample
        let value = sampleInfo.filter(result => result.id == sample);
        // Get the first index from the array
        let valueData = value[0];
        // Get the otu_ids, lables, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;
        // Log the data to the console
        console.log(otu_ids,otu_labels,sample_values); 
        // Set up the trace for bubble chart
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };
        // Set up the layout
        let layout = {
            title: "Bacteria Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };
        // Call Plotly to plot the bubble chart
        Plotly.newPlot("bubble", [trace1], layout)
    });
};
function optionChanged(value) {

    startMetadata(value);
    BarChart(value);
    BubbleChart(value);
}
init()