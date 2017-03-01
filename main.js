var filterProfiles = function filterProfiles(searchTerm){
    console.log('filter:', searchTerm);
    if(searchTerm === ''){
        $('.js-mp-profiles-live-source--hidden').removeClass('js-mp-profiles-live-source--hidden');
        $('.js-mp-profiles-live-results').addClass('js-mp-profiles-live-results--hidden');

    } else {
        var start = new Date().getTime();
        var results = window.fuse.search(searchTerm);
        var now = new Date().getTime();
        console.log(now - start);
        console.log(results);

        $('.js-mp-profiles-live-source').addClass('js-mp-profiles-live-source--hidden');

        var $results = $('.js-mp-profiles-live-results');
        $results.removeClass('js-mp-profiles-live-results--hidden');
        var $resultsUl = $results.children('ul');
        $resultsUl.empty();

        $.each(results, function(i, result){
            var $clone = $(result.item.el).clone();
            $clone.appendTo($resultsUl);
        });

        var now = new Date().getTime();
        console.log(now - start);
    }
}

$(function(){
    // Ideally, we only want to update the search state when the search input
    // text has been changed, ignoring other keystrokes like Ctrl-A / Ctrl-C.
    // Modern browsers and IE9+ support the `input` event. But some old
    // browsers like IE8 don't. So we provide `keyup` as a fallback.
    var filterInputEvent = 'input';
    if(jQuery.support && jQuery.support.input === false){
      filterInputEvent = 'keyup';
    }

    $('.js-mp-profiles-live-filter').on(filterInputEvent, function(){
        filterProfiles( $(this).val() );
    });

    $('.js-mp-profiles-live-filter').parents('form').on('submit', function(e){
        e.preventDefault();
        filterProfiles( $('.js-mp-profiles-live-filter').val() );
    })

    window.reps = [];
    $('.person-list-item').each(function(){
        window.reps.push({
            el: this,
            name: $(this).find('.name').text()
        });
    });

    window.fuse = new Fuse(window.reps, {
        shouldSort: true,
        threshold: 0.5,
        location: 0,
        distance: 64,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [ "name" ],
        include: [ "score", "matches" ]
    });
});
