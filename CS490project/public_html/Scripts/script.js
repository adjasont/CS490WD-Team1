/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function () {
    var controller = new Controller(movies["movies"]);
    
});



function Controller(data) {
    this.photos = data;
    this.searchData;
    
    /*** constants ***/
    this.movie_list="#movie_list";
    this.grid_icon="#grid_icon";
    this.list_icon="#list_icon";
    this.combo_box="#combo_box";
    this.movie_template="#movie-template";
    this.search_box = "#search_box";
    this.search_suggestions = ".suggestions";
    this.search_item = ".sub_suggestions";
    this.search_button = "#search_button";
    
    
    //bind some events
    var self = this; //pass a reference to controller
    var make_grid_function=function(){
        self.make_grid.call(self);
    };
    
    var make_list_function=function(){
        self.make_list.call(self);
    };
    
    var sort_photos=function(){
        self.sort_photos.call(self);
    };
    
    var search_films_function=function(){
        self.search_films.call(self);
    };
    
    this.select_film_function=function(){
        self.select_film.call(this);
    };

    this.return_search_results_function=function(){
        self.return_search_results.call(this);
    };
    
    $(this.grid_icon).on("click", make_grid_function);
    $(this.list_icon).on("click", make_list_function);
    $(this.combo_box).on('change',sort_photos);
    $(this.search_box).on('keyup',search_films_function);
    
    $("html").on('click',function(){
        $("#suggestions_box").hide();
    });
    
    
    this.load_photos();
    
}

Controller.prototype.load_photos = function() {
        //get the template
    var template=$(this.movie_template).html(); //get the template
    var html_maker = new htmlMaker(template); //create an html Maker
    var html = html_maker.getHTML(this.photos); //generate dynamic HTML based on the data
    $(this.movie_list).html(html);
};

Controller.prototype.sort_photos=function(){
    var by=$(this.combo_box).val().toLowerCase();
    this.photos=this.photos.sort(
            function(a,b){
                if(a[by]<b[by])
                    return -1;
                if(a[by]==b[by])
                    return 0;
                if(a[by]>b[by])
                    return 1;
            }            
            );
    
    this.load_photos();
    this.add_stars();
};


Controller.prototype.make_grid = function () {
    $(this.movie_list).attr("class", "grid");
    $(this.grid_icon).attr("src", "images/grid_pressed.jpg");
    $(this.list_icon).attr("src", "images/list.jpg");
};

Controller.prototype.make_list = function () {
    $(this.movie_list).attr("class", "list");
    $(this.grid_icon).attr("src", "images/grid.jpg");
    $(this.list_icon).attr("src", "images/list_pressed.jpg");
    this.add_stars();
};

Controller.prototype.search_films = function(){
    var films = movies["movies"];   
    var html="";
    var value = $("#search_box").val();
    var show = false;
    var index = 0;
    this.searchData = "";
    for (var i=0;i<films.length;++i){
        var titles = films[i].title.toLowerCase().search(value.toLowerCase().trim());
        var years = films[i].year.toString().search(value.toString().trim());
        var stars = films[i].starring.toLowerCase().search(value.toLowerCase().trim());
        if(titles != -1 || years != -1 || stars != -1)
        {
            if(index < 5)
            {
                index++;
                this.searchData+=films[i];
                html+= "<div class='sub_suggestions' id='" + films[i].title + "' ><b>";
                html+= films[i].title + "</b>(" + films[i].year + "), " + films[i].starring;
                html+= "</div>";
                show=true;
            }
        }
    }
    if(show){
        $("#suggestions_box").html(html);
        $("#suggestions_box").show();
        $(".sub_suggestions");
        $(this.search_item).on('click',this.select_film_function);
        $(this.search_button).on('click',this.return_search_results_function);
    }
    else
       $("#suggestions_box").hide();
};

Controller.prototype.select_film = function(){
    var id = $(this).attr("id");
    document.getElementById("search_box").value = id;
};

Controller.prototype.return_search_results = function(){
    var data = movies["movies"];
    var newData = [];
    var index = 0;
    var value = $("#search_box").val();
    var film = document.getElementById("search_box").value;
    var changeScreen = false;
    for(var i = 0; i < data.length; i++){
        var title = data[i].title.toLowerCase().search(value.toLowerCase().trim());
        var year = data[i].year.toString().search(value.toString().trim());
        var star = data[i].starring.toLowerCase().search(value.toLowerCase().trim());
        if(title != -1 || year != -1 || star != -1)
        {
            changeScreen = true;
            newData[index] = data[i];
            index++;
        }
    }
    if(changeScreen)
    {
        var controller = new Controller(newData);
    }
    if(value === "")
    {
        var controller = new Controller(data);
    }
};

Controller.prototype.add_stars = function() {
    var count = 0;
    var star_html = "";
    var movie = document.getElementsByClassName("movie");
    for (var i = 0; i < movie.length; i++){
        count = parseInt(movie[i].children[3].children[1].innerHTML);
        if(count >= 0){
            star_html ="";
            for (var j = 0; j < 5; j++) {
                if (j < count) {
                    star_html += "<div class='star'><img src='images/gold_star.png'></div>"
                }
                else {
                    star_html += "<div class='star'><img src='images/regular_star.png'></div>"
                }
            }
            movie[i].children[3].children[1].innerHTML= star_html;
        }
    }
};

