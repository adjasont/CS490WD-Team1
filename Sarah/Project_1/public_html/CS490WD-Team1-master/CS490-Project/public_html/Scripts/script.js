/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function () {
    var controller = new Controller(movies["movies"]);
    
});



function Controller(data) {
    this.movies = data;
    
    /*** constants ***/
    this.movie_list="#movie_list";
    this.grid_icon="#grid_icon";
    this.list_icon="#list_icon";
    this.combo_box="#combo_box";
    this.movie_template="#movie-template";
    this.search_box = "#search_box";
    this.search_suggestions = ".suggestions";
    this.search_item = ".sub_suggestions";
    
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
    var select_film_function=function(){
        self.select_film.call(self);
    };
    
    $(this.grid_icon).on("click", make_grid_function);
    $(this.list_icon).on("click", make_list_function);
    $(this.combo_box).on('change',sort_photos);
    $(this.search_box).on('keyup',search_films_function);
    $(this.search_suggestions).on('click',select_film_function); //adding children() breaks this when it is needed right now
    
    $("html").on('click',function(){
        $("#suggestions_box").hide();
    });
    
    this.load_photos();
   
    
}

Controller.prototype.load_photos = function() {
        //get the template
    var template=$(this.movie_template).html(); //get the template
    var html_maker = new htmlMaker(template); //create an html Maker
    var html = html_maker.getHTML(this.movies); //generate dynamic HTML based on the data
    $(this.movie_list).html(html);
    this.add_stars();
};

Controller.prototype.sort_photos=function(){
    var by=$(this.combo_box).val().toLowerCase();
    this.movies=this.movies.sort(
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
    
};

Controller.prototype.search_films = function(){
    var films = movies["movies"];   
    var html="";
    var value = $("#search_box").val();
    var show = false;
    for (var i=0;i<films.length;++i){
        var titles = films[i].title.toLowerCase().search(value.toLowerCase().trim());
        var years = films[i].year.toString().search(value.toString().trim());
        var stars = films[i].starring.toLowerCase().search(value.toLowerCase().trim());
        if(titles != -1 || years != -1 || stars != -1)
        {
            html+= "<div class='sub_suggestions' id='" + films[i].title + "' ><b>";
            html+= films[i].title + "</b>(" + films[i].year + "), " + films[i].starring;
            html+= "</div>";
            show=true;
        }
    }
    if(show){
        $("#suggestions_box").html(html);
        $("#suggestions_box").show();
        $(".sub_suggestions")
    }
    else
       $("#suggestions_box").hide();
};

Controller.prototype.select_film = function(search_item){
    //var tempTitle = toString(search_item.id);
    document.getElementById("search_box").value = "test";
};

Controller.prototype.add_stars = function() {
    var count = 0;
    var star_html = "";
    var movie = document.getElementsByClassName("movie");
    for (var i = 0; i < movie.length; i++){
        count = parseInt(movie[i].children[3].children[1].innerHTML);
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
};