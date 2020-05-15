
function pie() {

    // console.log("this is the year", window.global_year)
    // console.log("this is the carrier", window.selected_carrier)
    //use d3 to nest data

    d3.csv("../MyWebApp/data/2009-2018_aggregate.csv", function (data) {

        var dataset = [
            { label: 'airline', count: d3.sum(data.map(function (d) { if (d.year == window.global_year) { if (window.selected_carrier == "all") { return Math.round(d.arr_del15 / 60) } else if (d.carrier == window.selected_carrier) { return Math.round(d.arr_del15 / 60) } } })), },
            { label: 'carrier', count: d3.sum(data.map(function (d) { if (d.year == window.global_year) { if (window.selected_carrier == "all") { return Math.round(d.carrier_ct / 60) } else if (d.carrier == window.selected_carrier) { return Math.round(d.carrier_ct / 60) } } })), },
            { label: 'weather', count: d3.sum(data.map(function (d) { if (d.year == window.global_year) { if (window.selected_carrier == "all") { return Math.round(d.weather_ct / 60) } else if (d.carrier == window.selected_carrier) { return Math.round(d.weather_ct / 60) } } })), },
            { label: 'nas', count: d3.sum(data.map(function (d) { if (d.year == window.global_year) { if (window.selected_carrier == "all") { return Math.round(d.nas_ct / 60) } else if (d.carrier == window.selected_carrier) { return Math.round(d.nas_ct / 60) } } })), },
            { label: 'security', count: d3.sum(data.map(function (d) { if (d.year == window.global_year) { if (window.selected_carrier == "all") { return Math.round(d.security_ct / 60) } else if (d.carrier == window.selected_carrier) { return Math.round(d.security_ct / 60) } } })), },
            { label: 'late aircraft', count: d3.sum(data.map(function (d) { if (d.year == window.global_year) { if (window.selected_carrier == "all") { return Math.round(d.late_aircraft_ct / 60) } else if (d.carrier == window.selected_carrier) { return Math.round(d.late_aircraft_ct / 60) } } })), },
            { label: 'cancelled', count: d3.sum(data.map(function (d) { if (d.year == window.global_year) { if (window.selected_carrier == "all") { return Math.round(d.arr_cancelled / 60) } else if (d.carrier == window.selected_carrier) { return Math.round(d.arr_cancelled / 60) } } })), },
            { label: 'diverted', count: d3.sum(data.map(function (d) { if (d.year == window.global_year) { if (window.selected_carrier == "all") { return Math.round(d.arr_diverted / 60) } else if (d.carrier == window.selected_carrier) { return Math.round(d.arr_diverted / 60) } } })), },];

        // $.each(window["dataset"], function(key, value){
        //     console.log(key, value["count"]);
        // });





        //     var totalSum = []
        // flight_fields.forEach(function(field){

        // fieldSum = d3.sum(data.map(function (d) { if (d.year == 2018) { return d.field } }))
        // totalSum.push(fieldSum)
        // // d3.sum(data.map(function (d) { return d.feb })),
        // // d3.sum(data.map(function (d) { return d.march }))];

        //     console.log(totalSum);//[4, 9, 12]
        // });


        // console.log(window.dataset, "WINDOW DATA")
        // TODO change these dimensions
        // chart dimensions
        var width = 300;
        var height = 300;

        // a circle chart needs a radius
        var radius = Math.min(width, height) / 2;
        var donutWidth = 40; // size of donut hole. not needed if doing pie chart

        // legend dimensions
        var legendRectSize = 15; // defines the size of the colored squares in legend
        var legendSpacing = 6; // defines spacing between squares

        // define color scale
        var color = d3.scaleOrdinal(d3.schemeCategory20c);
        // more color scales: https://bl.ocks.org/pstuffa/3393ff2711a53975040077b7453781a9

        // calculate new total
        var total = d3.sum(dataset, d => d.count);
        // define new total section
        var newTotal = d3.select('.new-total-holder')
            .append('span')
            .attr('class', 'newTotal').text(total);

        var svg = d3.select('#chart') // select element in the DOM with id 'chart'
            .append('svg') // append an svg element to the element we've selected
            .attr('width', width) // set the width of the svg element we just added
            .attr('height', height) // set the height of the svg element we just added
            .append('g') // append 'g' element to the svg element
            .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')'); // our reference is now to the 'g' element. centerting the 'g' element to the svg element

        var arc = d3.arc()
            .innerRadius(radius - donutWidth) // radius - donutWidth = size of donut hole. use 0 for pie chart
            .outerRadius(radius); // size of overall chart

        var pie = d3.pie() // start and end angles of the segments
            .value(function (d) { return d.count; }) // how to extract the numerical data from each entry in our dataset
            .sort(null); // by default, data sorts in oescending value. this will mess with our animation so we set it to null

        //**********************
        //        TOOLTIP
        //**********************

        var tooltip = d3.select('#chart') // select element in the DOM with id 'chart'
            .append('div') // append a div element to the element we've selected                                    
            .attr('class', 'tooltip_pie'); // add class 'tooltip' on the divs we just selected

        tooltip.append('div') // add divs to the tooltip defined above
            .attr('class', 'label'); // add class 'label' on the selection
        tooltip.append('div') // add divs to the tooltip defined above   
            .attr('class', 'count'); // add class 'count' on the selection                  
        tooltip.append('div') // add divs to the tooltip defined above  
            .attr('class', 'percent'); // add class 'percent' on the selection

        // Confused? see below:

        // <div id="chart">
        //   <div class="tooltip">
        //     <div class="label">
        //     </div>
        //     <div class="count">
        //     </div>
        //     <div class="percent">
        //     </div>
        //   </div>
        // </div>

        dataset.forEach(function (d) {
            d.count = +d.count; // calculate count as we iterate through the data
            d.enabled = true; // add enabled property to track which entries are checked
        });
        // creating the chart
        var pieparts = pie(dataset);
        var path = svg.selectAll('path') // select all path elements inside the svg. specifically the 'g' element. they don't exist yet but they will be created below
            .data(pieparts) //associate dataset wit he path elements we're about to create. must pass through the pie function. it magically knows how to extract values and bakes it into the pie
            .enter() //creates placeholder nodes for each of the values
            .append('path') // replace placeholders with path elements
            .attr('d', arc) // define d attribute with arc function above
            .attr('fill', function (d) { return color(d.data.label); }) // use color scale to define fill of each label in dataset
            .each(function (d) { this._current - d; }); // creates a smooth animation for each track
        // mouse event handlers are attached to path so they need to come after its definition
        path.on('mouseover', function (a) {  // when mouse enters aiv    
            // var total = d3.sum(dataset.map(function (d) { // calculate the total number of tickets in the dataset    
            //     return (d.enabled) ? d.count : 0; // checking to see if the entry is enabled. if it isn't, we return 0 and cause other percentages to increase                                      
            // }));
            var total = 0;
            $.each(dataset, function (key, value) {
                if (value.enabled == true) {
                    total += value.count;
                }
            })

            rawPercent = (1000 * a.data.count / total) / 10;
            var percent = rawPercent.toFixed(2); // calculate percent
            tooltip.select('.label').html(a.data.label); // set current label           
            tooltip.select('.count').html('total hours: ' + a.data.count); // set current count            
            tooltip.select('.percent').html(percent + '%'); // set percent calculated above          
            tooltip.style('display', 'block'); // set display                     
        });

        path.on('mouseout', function () { // when mouse leaves div                        
            tooltip.style('display', 'none'); // hide tooltip for that element
        });

        path.on('mousemove', function (d) { // when mouse moves                  
            tooltip.style('top', (d3.event.layerY + 10) + 'px') // always 10px below the cursor
                .style('left', (d3.event.layerX + 10) + 'px'); // always 10px to the right of the mouse
        });

        // define legend
        var legend = svg.selectAll('.legend') // selecting elements with class 'legend'
            .data(color.domain()) // refers to an array of labels from our dataset
            .enter() // creates placeholder
            .append('g') // replace placeholders with g elements
            .attr('class', 'legend') // each g is given a legend class
            .attr('transform', function (d, i) {
                var height = legendRectSize + legendSpacing; // height of element is the height of the colored square plus the spacing      
                var offset = height * color.domain().length / 2; // vertical offset of the entire legend = height of a single element & half the total number of elements  
                var horz = -2 * legendRectSize; // the legend is shifted to the left to make room for the text
                var vert = i * height - offset; // the top of the element is hifted up or down from the center using the offset defiend earlier and the index of the current element 'i'               
                return 'translate(' + horz + ',' + vert + ')'; //return translation       
            });

        // adding colored squares to legend
        legend.append('rect') // append rectangle squares to legend                                   
            .attr('width', legendRectSize) // width of rect size is defined above                        
            .attr('height', legendRectSize) // height of rect size is defined above                      
            .style('fill', color) // each fill is passed a color
            .style('stroke', color) // each stroke is passed a color
            .on('click', function (label) {
                var rect = d3.select(this); // this refers to the colored squared just clicked
                var enabled = true; // set enabled true to default
                var totalEnabled = d3.sum(dataset.map(function (d) { // can't disable all options
                    return (d.enabled) ? 1 : 0; // return 1 for each enabled entry. and summing it up
                }));
                if (rect.attr('class') === 'disabled') { // if class is disabled
                    rect.attr('class', ''); // remove class disabled
                } else { // else
                    if (totalEnabled < 2) return; // if less than two labels are flagged, exit
                    rect.attr('class', 'disabled'); // otherwise flag the square disabled
                    enabled = false; // set enabled to false
                }

                pie.value(function (d) {
                    if (d.label === label) d.enabled = enabled; // if entry label matches legend label
                    return (d.enabled) ? d.count : 0; // update enabled property and return count or 0 based on the entry's status
                });

                path = path.data(pie(dataset)); // update pie with new data

                path.transition() // transition of redrawn pie
                    .duration(750) // 
                    .attrTween('d', function (d) { // 'd' specifies the d attribute that we'll be animating
                        var interpolate = d3.interpolate(this._current, d); // this = current path element
                        this._current = interpolate(0); // interpolate between current value and the new value of 'd'
                        return function (t) {
                            return arc(interpolate(t));
                        };
                    });

                // calculate new total
                var newTotalCalc = d3.sum(dataset.filter(function (d) { return d.enabled; }), d => d.count)
                // console.log(newTotalCalc);

                // append newTotalCalc to newTotal which is defined above
                newTotal.text(newTotalCalc);
            });

        // adding text to legend
        legend.append('text')
            .attr('x', legendRectSize + legendSpacing)
            .attr('y', legendRectSize - legendSpacing)
            .text(function (d) { return d; }); // return label

    });

    ///



}


// Ref: https://www.webdeveloper.com/d/64029-global-variables-not-getting-recognized-on-page-onload/3
// that creates a problem: if you assign a value to 'stored' inside those braces, it won't be global, and if you put it outside the braces, it will be undefined--like it is now--because no html elements exist when the statement is executed.

// There are two solutions to that problem:

// 1) You can declare the variable outside the function, and assign it inside the function:

// var stored;
// window.onload=function() 
// {
//     stored = .....;

// };
// 2) Create a global variable from inside the function:

// window.onload=function() 
// {
//     window["stored"] = ....;

// };