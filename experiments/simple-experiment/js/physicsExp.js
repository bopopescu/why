function make_slides(f) {
    var   slides = {};

    
    slides.i0 = slide(
        {
            name : "i0"
        }
    );

    slides.freeResponse = slide(
        {
            name : "freeResponse",
            //Test Phrases
            present: [{phrase : "The scissors are sharp", type : "gradableAdj"},
                      {phrase : "The knife is dull", type : "gradableAdj"},
                      {phrase : "The tea is hot", type : "gradableAdj"},
                      {phrase : "The coffee is cold", type : "gradableAdj"},
                      {phrase : "The tea is sweet", type : "gradableAdj"},
                      {phrase : "The coffee is bitter", type : "gradableAdj"},
                      {phrase : "The motorcycle is fast", type : "gradeableAdj"},
                      {phrase : "The car is slow", type : "gradeableAdj"}, 
                      {phrase : "The apple fell from the tree", type : "physics"},
                      {phrase : "The ball rolled down the hill", type : "physics"},
                      {phrase : "The clock ticked", type : "designer"},
                      {phrase : "The tiger has stripes", type :"evolutionary"},
                      {phrase : "The bird has wings", type: "evolutionary"},
                      {phrase : "Fish have scales", type : "evolutionary"}
                     ],

            start : function() {
            },

            present_handle : function(stim) {
                console.log(stim);
                exp.data_trials.push(stim);
                console.log(exp.data_trials);

                $("#phraseInput").val("");
                //Get Phrase
                exp.phrase = stim.phrase;
                exp.phraseType = stim.phraseType;
                //Update Phrase
                $('.physPhrase').each(function(){$(this).text(exp.phrase);});

            },

            button : function() {
                var res = {};
                $('input[type="text"]').each( //Makes sure each input is filled
                    function(){
                        res[$(this).attr("name")] = $(this).val();
                    });
                console.log(res);
                _.last(exp.data_trials)["phraseInput"] = $("#phraseInput").val();
                if (_.last(exp.data_trials)["phraseInput"] != "") {
                     //exp.data_trials.push(res);
                    _stream.apply(this);
                }
            }
        }    
    );


    slides.textInput_ranking = slide(
        {
            name : "textInput_ranking",
            present: [{prop: .6, num_samples:10},
                      {prop: .4, num_samples:10},
                      {prop: .5, num_samples:10},
                      {prop: 1, num_samples:10},
                      {prop: .2, num_samples:10},
                      {prop: 0, num_samples:10},
                      {prop: .8, num_samples:10}
                     ],

            start : function() {
            },

            present_handle : function(stim) {
                console.log(stim);
                exp.data_trials.push(stim);

                $("#horse1_rank").val("");
                $("#horse2_rank").val("");
                $("#horse3_rank").val("");
                //get new horse names
                exp.horse_names = [get_horse_name(),get_horse_name(), get_horse_name()];

                //update horses names
                $('.horse1_name').each(function(){$(this).text(exp.horse_names[0]);});
                $('.horse2_name').each(function(){$(this).text(exp.horse_names[1]);});
                $('.horse3_name').each(function(){$(this).text(exp.horse_names[2]);});


                //update table with win data
                $('#horse2').text(Math.round(stim.num_samples * stim.prop) + "");
                $('#horse1').text(Math.round(stim.num_samples * (1-stim.prop)*.85) +"");
                $('#horse3').text(Math.round(stim.num_samples * (1-stim.prop)*.15) +"");
                $('#race_total').text(stim.num_samples);
            },

            button : function() {
                var res = {};
                $('input[type="text"]').each( //Makes sure each input is filled
                    function(){
                        res[$(this).attr("name")] = $(this).val();
                    });
                console.log(res);
                _.last(exp.data_trials)["rank1"] =  $("#horse1_rank").val();
                _.last(exp.data_trials)["rank2"] =  $("#horse2_rank").val();
                _.last(exp.data_trials)["rank3"] =  $("#horse3_rank").val();

                if (_.last(exp.data_trials)["rank1"] != "" && _.last(exp.data_trials)["rank2"] != "" && _.last(exp.data_trials)["rank3"] != "") {
                     exp.data_trials.push(res);
                    _stream.apply(this);
                }
            }
        }
    );

    slides.repeated_stims = slide(
        {
            name : "repeated_stims",
            present: [{prop: .6, num_samples:5},
                      {prop: .4, num_samples:5},
                      {prop: .5, num_samples:4},
                      {prop: 1, num_samples:5},
                      {prop: .2, num_samples:5},
                      {prop: 0, num_samples:5},
                      {prop: .8, num_samples:5}
                     ],

            start: function(){
                // example of moving html blocks around
                // $('#res_sum').prependTo("#baseline");
                // $('#test_sliders').insertAfter("#res_sum");
                // $('<br/><br/><br/>').insertBefore("#test_sliders");
            },

            present_handle : function(stim){
                console.log(stim);
                this.init_sliders();
                exp.data_trials.push(stim);

                //get new horse names
                exp.horse_names = [get_horse_name(),get_horse_name()];

                //update horses names
                $('.horse1_name').each(function(){$(this).text(exp.horse_names[0]);});
                $('.horse2_name').each(function(){$(this).text(exp.horse_names[1]);});

                //update table with win data
                $('#horse2').text(Math.round(stim.num_samples * stim.prop) + "");
                $('#horse1').text(Math.round(stim.num_samples * (1-stim.prop)) +"");
                $('#race_total').text(stim.num_samples);
            },
            button : function() {
                if(_.all(exp.sliderPost, function(x){return(x<500);})){
                    _.last(exp.data_trials)["version"]= "baseline";
                    _.last(exp.data_trials)["pid"]= this.phaseid;
                    _.last(exp.data_trials)["prop_estimate"]= exp.sliderPost[0];
                    _.last(exp.data_trials)["confidence"]= exp.sliderPost[1];
                    if(this.version=="pre") exp.data_trials.push($.extend(true, {}, _.last(exp.data_trials)));
                    if(exp.canvas) exp.canvas.remove();
                    _stream.apply(this);
                }
            },
            init_sliders : function() {

                exp.sliderPost=[500,500];

                if (this.version === "baseline") {
                    $('#test_text').hide();
                    $('#baseline_test_text').show();
                }
                else{
                    $('#test_text').show();
                    $('#baseline_test_text').hide();
                }

                $(".sim_slide").css('width' , 3*(exp.width/4)).centerhin();
                $(".slider-lbl1 ").css('right' , (exp.width/4) *3.2 +20);
                $(".slider-lbl2 ").css('left' , (exp.width/4) *3.2 +20);
                $(".slider-lbl3 ").css('left' , (exp.width/2));
                $("#test_slide").slider({
                    range : "min",
                    value : 50,
                    min : 0,
                    max : 100,
                    slide : function(event, ui) {
                        exp.sliderPost[0] = ui.value/100;
                    }
                });
                $("#test_slide").mousedown(function(){$("#test_slide a").css('display', 'inherit');});
                $("#test_slide").slider("option","value",0);//reset slider


                $("#confidence_slide").slider({
                    range : "min",
                    value : 50,
                    min : 0,
                    max : 100,
                    slide : function(event, ui) {
                        exp.sliderPost[1] = ui.value/100;
                    }
                });
                $("#confidence_slide").mousedown(function(){$("#confidence_slide a").css('display', 'inherit');});
                $("#confidence_slide").slider("option","value",0);//reset slider
                $(".ui-slider-handle").css('display', 'none');
            }
        });



    //!subj_info
    
    slides.subj_info =  slide(
        {
            name : "subj_info",
            start : function () {
                $('#subj_info_form').submit(this.button);
            },
            button : function(e){
                if (e.preventDefault) e.preventDefault();
                exp.subj_data =
                    [{
                        language: $('select[name="language"]').val(),
                        enjoyment: $('select[name="enjoyment"]').val(),
                        assess: $('input[name="assess"]:checked').val(),
                        age : $('input:text[name="age"]').val(),
                        sex : $('input[name="sex"]:checked').val(),
                        education : $('select[name="education"]').val(),
                        workerId : turk.workerId
                    }];

                exp.go();
                return false;
            }

        }
    );

    
    slides.thanks = slide(
        {
            name : "thanks",
            start : function(){

                exp.data= {
                    trials : exp.data_trials,
                    system : exp.system,
                    condition : exp.condition
                };
                setTimeout(function() {turk.submit(exp.data);}, 1000);
            }
        });
    return slides;
};

/// init ///
function init() {
    jquery_extensions();
    $('.slide').hide();
    $('body').css('visibility','visible');
    exp_sizing();

    exp.data_trials=[];
    exp.sandbox=0;
    exp.slides = make_slides(exp);

    exp.structure=[ "i0",  "freeResponse", //'textInput_ranking',//'show_some_images',
      //'conf_trial',  //'repeated_stims', 
      'subj_info', 'thanks'];
    set_condition();

    //allow to click through experiment
    exp.debug=1;
    if (exp.debug){
        console.log('debug');
        $('#start-button').click(function(){exp.go();});
    }
    else{
        $('#start-button').click(function(){experiment_proceed();});
    }

    exp.system =
        [{
            workerId : turk.workerId,
            cond : exp.condition,
            Browser : BrowserDetect.browser,
            OS : BrowserDetect.OS,
            screenH: screen.height,
            screenUH: exp.height,
            screenW: screen.width,
            screenUW: exp.width
        }];

    exp.go();

};



function set_condition(){
    exp.condition={dependent:"hl_num",
                   bins:"lmh"
                  };
    var zname = get_zach_name();
    $('.zach_name').each(function(){$(this).text(zname);});
}

// example helper function (also a closure!)
get_zach_name= function(){
    var names=["James", "John", "Robert", "Michael", "William", "David", "Richard", "Charles", "Joseph", "Thomas", "Christopher", "Daniel", "Paul", "Mark", "Donald", "George", "Kenneth", "Steven", "Edward", "Brian", "Ronald", "Anthony", "Kevin", "Jason", "Matthew", "Gary", "Timothy", "Jose", "Larry", "Jeffrey", "Frank", "Scott", "Eric", "Stephen", "Andrew", "Raymond", "Gregory", "Joshua", "Jerry", "Dennis", "Walter", "Patrick", "Peter", "Harold", "Douglas", "Henry", "Carl", "Arthur", "Ryan", "Roger", "Joe", "Juan", "Jack", "Albert", "Jonathan", "Justin", "Terry", "Gerald", "Keith", "Samuel", "Willie", "Ralph", "Lawrence", "Nicholas", "Roy", "Benjamin", "Bruce", "Brandon", "Adam", "Harry", "Fred", "Wayne", "Billy", "Steve", "Louis", "Jeremy", "Aaron", "Randy", "Howard", "Eugene"];

    names = _(names).shuffle();
    return function(){
        return names.pop();
    };
}();


// example helper function (also a closure!)
var get_horse_name= function(){
    var horses=["Maple Thor","FlyingFog","Dagwood Fears","Mod Tap","Rosy Slang","Ouch Pouch","Ken Dread Spirit","Exoville","Tom Foolery","Balancing Action","Retro-Yo","Abundance Grand","Fix n' Vix","Existential X","Illustrious Oh","Tori Bora","Erstwhile","Crowd Daddy","Basking Bingo","Trips not Trips","Zensure","Mr. Cup-a-Soup","Svelt Smelt","Libation Nation","Crutos","Technoasis","Pretzel","Diet Smokes","Laugh Tax","Bleendot","Yo Comprehension","Twinkies Don't Count","Captain Bamboo","Closet Palace","Tino Cooper","Pearlescient","Green Mole","Chomsky","Mr. Sunnymoon","Retail Dentist","Vigration","Soft Shark","Post Mortadella","Juke London","Glow Wonder","Mr. Mercurial","60 Grit","Silver Demand","Chow Biscuit","Love That Loot","Question Quest","Counter Clone","Picnic Train","Huffington Heights","Sunbright Sparrow","Panic Button","Pancho Casanova","Tropicantor","Zen Shin","Water Back","Pirate School","Rank","Wind Shear","Conundreampt","Que West","Dr. Haste","Miles Alpha","Guru Static","Chateau Yo","Habitual Church","Truth Spock","The Deuce","Pawnagra","Airborne Pickle","Two Faux","Here Comes Me","Habit Taught","Princess Plex","Grammburglar","Acid Rein","Stamina","Fez","Weeeeeeeee","Narrow Barrow","Faux Boil","Flame-Thrower","Pen the Tale","Tuscany Tucson","Smackdab Init","Go Ned!","Izzy Bell","Never No","Floppy Zinger","Columbo Logic","Turtle Problems","Below the Beltway","Historia Fonz","Pumpty Dumpty"];
    horses = _(horses).shuffle();
    return function(){
        return horses.pop();
    };
}();
