$(function () {
    var includes = $('[data-include]')
    console.log(includes);
    $.each(includes, function () {

        var file = '../html/' + $(this).data('include') + '.html'
        $(this).load(file)
    })
})
