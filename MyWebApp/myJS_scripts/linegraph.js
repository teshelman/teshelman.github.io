// TODO finish for tomorrow
function linegraph() {
    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 30, bottom: 35, left: 80 },
        width = 500 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width + 100 + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")")
    // .style("overflow", "visible");

    //Read the data
    d3.csv("../MyWebApp/data/2009-2018_aggregate.csv", function (data) {
        var month_totals = [];
        var i = 1;
        for (i; i <= 12; i++) {
            window["dataset"] = [
                { label: 'airline', count: d3.sum(data.map(function (d) { if (d.year == window.global_year) { if (d.month == i) { if (window.selected_carrier == "all") { return d.arr_del15 } else if (d.carrier == window.selected_carrier) { return d.arr_del15 } } } })) },
                { label: 'carrier', count: d3.sum(data.map(function (d) { if (d.year == window.global_year) { if (d.month == i) { if (window.selected_carrier == "all") { return d.carrier_ct } else if (d.carrier == window.selected_carrier) { return d.carrier_ct } } } })) },
                { label: 'weather', count: d3.sum(data.map(function (d) { if (d.year == window.global_year) { if (d.month == i) { if (window.selected_carrier == "all") { return d.weather_ct } else if (d.carrier == window.selected_carrier) { return d.weather_ct } } } })) },
                { label: 'nas', count: d3.sum(data.map(function (d) { if (d.year == window.global_year) { if (d.month == i) { if (window.selected_carrier == "all") { return d.nas_ct } else if (d.carrier == window.selected_carrier) { return d.nas_ct } } } })) },
                { label: 'security', count: d3.sum(data.map(function (d) { if (d.year == window.global_year) { if (d.month == i) { if (window.selected_carrier == "all") { return d.security_ct } else if (d.carrier == window.selected_carrier) { return d.security_ct } } } })) },
                { label: 'late aircraft', count: d3.sum(data.map(function (d) { if (d.year == window.global_year) { if (d.month == i) { if (window.selected_carrier == "all") { return d.late_aircraft_ct } else if (d.carrier == window.selected_carrier) { return d.late_aircraft_ct } } } })) },
                { label: 'cancelled', count: d3.sum(data.map(function (d) { if (d.year == window.global_year) { if (d.month == i) { if (window.selected_carrier == "all") { return d.arr_cancelled } else if (d.carrier == window.selected_carrier) { return d.arr_cancelled } } } })) },
                { label: 'diverted', count: d3.sum(data.map(function (d) { if (d.year == window.global_year) { if (d.month == i) { if (window.selected_carrier == "all") { return d.arr_diverted } else if (d.carrier == window.selected_carrier) { return d.arr_diverted } } } })) },];

            // month_totals[i] = {};
            var totals = {};
            totals["total"] = 0;
            // month_totals[i]["totals"] = 0;
            $.each(window["dataset"], function (key, value) {
                // console.log(key, value["count"]);
                if (value["label"] == "cancelled") {
                    totals["cancelled"] = +value["count"]
                    // month_totals[i]["cancelled"] = +value["count"]
                } else if (value["label"] == "diverted") {
                    totals["diverted"] = +value["count"]
                    // month_totals[i]["diverted"] = +value["count"]
                } else {
                    hours = (Math.round(value["count"] / 60))
                    totals["total"] += (hours)
                    // month_totals[i]["totals"] += +value["count"]
                }
                j = i - 1
                month_totals[j] = totals
            });

            // month_totals[i] = window["dataset"][]
        }

        // console.log(month_totals);
        var max = 0;
        var min = 0;
        $.each(month_totals, function (key, value) {
            // console.log(key, value)
            if (value.total > max) {
                max = value.total;
            }
            if (value.total < min) {
                min = value.total;
            }

        });
        if (min > 0) {
            min = 0;
        }
        // console.log("max",max);
        // console.log("min",min);

        // Add X axis --> it is a date format
        var x = d3.scaleLinear()
            .domain([1, 12])
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));
        // Add the x Axis

        // text label for the x axis
        svg.append("text")
            .attr("transform",
                "translate(" + (width / 2) + " ," +
                (height + margin.top + 25) + ")")
            .style("text-anchor", "middle")
            .text("Month");

        // Add Y axis

        var y = d3.scaleLinear()
            .domain([min, max])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));
        
            // text label for the y axis
        svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Delay (Hours)");

        // This allows to find the closest X index of the mouse:
        var bisect = d3.bisector(function (d) { return d.x; }).left;

        // Create the circle that travels along the curve of chart
        var focus = svg
            .append('g')
            .append('circle')
            .style("fill", "none")
            .attr("stroke", "black")
            .attr('r', 8.5)
            .style("opacity", 0)

        // Create the text that travels along the curve of chart
        var focusText = svg
            .append('g')
            .append('text')
            .style("opacity", 0)
            .attr("text-anchor", "left")
            .attr("alignment-baseline", "middle")

        // Add the line
        // svg
        //     .append("path")
        //     .datum(data)
        //     .attr("fill", "none")
        //     .attr("stroke", "steelblue")
        //     .attr("stroke-width", 1.5)
        //     .attr("d", d3.line()
        //         .x(function (d) { return x(d.x) })
        //         .y(function (d) { return y(d.y) })
        //     )
        var i = 1;

        svg
            .append("path")
            .datum(month_totals)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                // .x(function (d) { console.log(d.total); return x(d.total) })
                .x(function (d) {

                    // console.log(d.total);
                    vert = i;
                    // console.log(vert);
                    i++;
                    return x(+vert)
                })
                .y(function (d) {

                    // vert = i;
                    // // console.log(vert);
                    // i++;
                    // return y(+vert)
                    return y(d.total)
                })
            );

        // Create a rect on top of the svg area: this rectangle recovers mouse position
        svg
            .append('rect')
            .style("fill", "none")
            .style("pointer-events", "all")
            .attr('width', width)
            .attr('height', height)
            .on('mouseover', mouseover)
            .on('mousemove', mousemove)
            .on('mouseout', mouseout);


        // What happens when the mouse move -> show the annotations at the right positions.
        function mouseover() {
            focus.style("opacity", 1)
            focusText.style("opacity", 1)
        }

        var totalsXCoords = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        function mousemove() {
            // recover coordinate we need
            var x0 = x.invert(d3.mouse(this)[0]);
            // console.log(x0)
            // console.log(Math.round(x0))
            // var i = bisect(totalsXCoords, Math.round(x0), 1);
            var i = Math.round(x0)
            // console.log(i)
            selectedData = month_totals[i - 1]['total']
            // console.log("what is this", selectedData.x);
            focus
                .attr("cx", x(i))
                .attr("cy", y(selectedData))
            focusText
                .html("Month: " + i + ", " + "Delay: " + selectedData)
                .attr("x", x(i) + 15)
                .attr("y", y(selectedData))
        }
        function mouseout() {
            focus.style("opacity", 0)
            focusText.style("opacity", 0)
        }

    })
}
