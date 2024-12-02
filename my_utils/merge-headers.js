export class GameHeaders {
  constructor() {
    this.headers = [
      { id: "title", title: "Title" },
      { id: "slug", title: "Slug" },
      { id: "platform", title: "Platform" },
      { id: "genre", title: "Genre" },
      { id: "publisher", title: "Publisher" },
      { id: "developer", title: "Developer" },
      { id: "release_date", title: "Release Date" },
      { id: "age_rating", title: "Age Rating" },
      { id: "price", title: "Price" },
      { id: "discounted_price", title: "Discounted Price" },
      { id: "metascore", title: "Metascore" },
      { id: "user_score", title: "User Score" },
      { id: "website", title: "Website" },
      { id: "description", title: "Description" },
      { id: "supported_languages", title: "Supported Languages" },
      { id: "game_features", title: "Game Features" },
      { id: "steam_tags", title: "Steam Tags" },
      { id: "achievements", title: "Achievements" },
      { id: "reviews_count", title: "Reviews Count" },
      { id: "ranking", title: "Ranking" },
      { id: "rating_top", title: "Rating Top" },
    ];
    this.columnMap = {
      title: ["Title", "Name", "game", "game_en", "game_name"],
      slug: ["Slug", "slug", "game_slug"],
      platform: ["Platform", "Release.Console", "platform", "platforms"],
      genre: ["Metadata.Genres", "Genre", "genres"],
      publisher: ["Metadata.Publishers", "Publisher", "publishor/developer"],
      developer: ["developer", "developers", "Studio/company"],
      release_date: [
        "Release.Year",
        "release_date",
        "released",
        "Release Date",
        "Year_of_Release"
      ],
      age_rating: [
        "Release.Rating",
        "classification",
        "Release-Rating",
        "esrb_rating",
        "required_age",
        "Rating"
      ],
      price: ["Original Price", "price"],
      discounted_price: ["Discounted Price"],
      metascore: ["Metrics.Review Score", "metacritic", "Metascore"],
      user_score: ["User_Score", "website_rating", "Avg_Userscore"],
      website: ["website", "url"],
      description: [
        "short_description",
        "detailed_description",
        "Game Description",
      ],
      supported_languages: ["Supported Languages"],
      game_features: ["Game Features"],
      steam_tags: ["Popular Tags", "steamspy_tags"],
      achievements: ["achievements", "achievements_count"],
      reviews_count: ["reviews_count"],
      ranking: ["rank"],
      rating_top: ["rating_top"],
    };
  }
}

export class ReviewHeaders {
  constructor() {
    this.headers = [
      { id: "game", title: "Game" },
      { id: "username", title: "Username" },
      { id: "review_text", title: "Review Text" },
      { id: "review_score", title: "Review Score" },
      { id: "review_votes", title: "Review Votes" },
      { id: "hours_played", title: "Hours Played" },
      { id: "recommendation", title: "Recommendation" },
      { id: "date", title: "Date" },
    ];
  }
}

export class SalesHeaders {
  constructor() {
    this.headers = [
      { id: "game", title: "Game" },
      { id: "year_of_release", title: "Year of Release" },
      { id: "na_sales", title: "NA Sales" },
      { id: "eu_sales", title: "EU Sales" },
      { id: "jp_sales", title: "JP Sales" },
      { id: "other_sales", title: "Other Sales" },
      { id: "global_sales", title: "Global Sales" },
    ];
  }
}

export class RankingHeaders {
  constructor() {
    this.headers = [
      { id: "game", title: "Game" },
      { id: "rank_type", title: "Rank Type" },
      { id: "rank", title: "Rank" },
      { id: "category", title: "Category" },
      { id: "studio", title: "Studio" },
      { id: "year", title: "Year" },
    ];
  }
}

export class LongToBeatHeaders {
  constructor() {
    this.headers = [
      { id: "game", title: "Game" },
      { id: "all_playstyles", title: "All Playstyles" },
      { id: "completionists", title: "Completionists" },
      { id: "with_extras", title: "With Extras" },
      { id: "main_story", title: "Main Story" },
    ];
  }
}

export class GameAwardsHeaders {
  constructor() {
    this.headers = [
      { id: "game", title: "Game" },
      { id: "year", title: "Year" },
      { id: "category", title: "Category" },
      { id: "winner", title: "Winner" },
    ];
  }
}
