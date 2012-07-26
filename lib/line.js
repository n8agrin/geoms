var line = function() {
    var geom,
        x = function(d) { return d[0]; },
        y = function(d) { return d[1]; },
        group = function(d) { return d[2]; },
        r = d3.functor(4),
        interpolate = d3.functor('monotone'),
        color = group,
        size = [1, 1],
        scales = {
            x: d3.scale.linear(),
            y: d3.scale.linear(),
            color: d3.scale.category20()
        };

    geom = function() {
        var width = size[0],
            height = size[1],
            path = d3.svg.line()
                .interpolate(interpolate())
                .x(function(p) { return scales.x(x(p)); })
                .y(function(p) { return height - scales.y(y(p)); });

        this.each(function() {
            var lineGroups,
                lines,
                linesEnter,
                linesUpdate
                grouper = d3.nest().key(group),
                dThis = d3.select(this);

            lineGroups = dThis.selectAll('g.group')
                .data(grouper.entries);

            lineGroups.enter()
                .append('g')
                .attr('class', function(d) { return 'group ' + d.key});

            d3.transition(lineGroups.exit())
                .remove();

            lines = lineGroups.selectAll('path')
                .data(function(pathset) { return [pathset.values]; });

            linesEnter = lines.enter()
                .append('path');

            linesExit = d3.transition(lines.exit())
                .remove();

            linesUpdate = d3.transition(lines)
                .attr('d', path);
        });
    };

    geom.interpolate = function(v) {
        if (arguments.length) {
            interpolate = typeof v == 'function' ? v : d3.functor(v);
            return geom;
        }
        return interpolate;
    }

    geom.x = function(v) {
        if (arguments.length) {
            x = v;
            return geom;
        }
        return x;
    }

    geom.y = function(v) {
        if (arguments.length) {
            y = v;
            return geom;
        }
        return y;
    }

    geom.r = function(v) {
        if (arguments.length) {
            r = typeof v == 'function' ? v : d3.functor(v);
            return geom;
        }
        return r;
    }

    geom.group = function(v) {
        if (arguments.length) {
            group = v;
            return geom;
        }
        return group;
    }

    geom.color = function(v) {
        if (arguments.length) {
            color = v;
            return geom;
        }
        return color;
    }

    geom.scales = function(v) {
        if (arguments.length) {
            scales = v;
            return geom;
        }
        return scales;
    }

    geom.size = function(v) {
        if (arguments.length) {
            size = v;
            return geom;
        }
        return size;
    }

    return geom;
}

// class rene.Line extends rene.Layer

//     constructor: ->
//         super
//         @interpolate = 'monotone'

//     scales:
//         x: d3.time.scale
//         y: d3.scale.linear
//         color: d3.scale.category20
//         size: d3.scale.linear

//     render: (group, scales, width, height) =>
//         path = d3.svg.line()
//             .interpolate(@interpolate)
//             .x((point) -> scales.x(point.x))
//             .y((point) -> height - scales.y(point.y))

//         group.classed('line', true)

//         group.each (dataset) ->
//             lineGroups = d3.select(this)
//                 .selectAll('g')
//                 .data(dataset)

//             lineGroups.enter()
//                 .append('g')

//             d3.transition(lineGroups.exit())
//                 .remove()

//             # The input dataset looks like:
//             # [
//             #   // Group 1
//             #   [point 1..., point 2...],
//             #   // Group 2
//             #   [point 1..., point 2...]
//             # ]
//             #
//             # if we just use the identify function here to rebind data, it will
//             # try to create as many path elements as there are points. Instead
//             # points are part of a path vector and need to be rebound in an array.
//             lines = lineGroups.selectAll('path')
//                 .data((pathset) -> [pathset])

//             linesEnter = lines.enter()
//                 .append('path')

//             linesExit = d3.transition(lines.exit())
//                 .remove()

//             linesUpdate = d3.transition(lines)
//             linesUpdate.attr("d", path)

//             if scales.color
//                 linesUpdate.style('stroke', (pathset) -> if pathset[0]? then scales.color(pathset[0].color))