$(document).ready(function () {
    $(".elementor-tab-title").click(function () {
        let __that = $(this)
        let __id = __that.attr('id')

        let __content = __that.find(`[aria-labelledby=${__id}]`)
        __content.show();

        alert("done here")
    });
})