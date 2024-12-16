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
      { id: "rating_top", title: "Rating Top" },
    ];
    this.columnMap = {
      title: ["Title", "Name", "name", "Game", "game", "game_en", "game_name"],
      slug: ["Slug", "slug", "game_slug"],
      platform: ["Platform", "platform", "Release-Console", "platforms"],
      genre: ["Metadata-Genres", "Genre", "genre", "genres"],
      publisher: [
        "Metadata-Publishers",
        "Publisher",
        "publisher",
        "publishers",
        "publishor/developer",
      ],
      developer: [
        "developer",
        "developers",
        "Developer",
        "Developers",
        "Studio/company",
        "publishor/developer",
      ],
      release_date: [
        "Release-Year",
        "release_date",
        "released",
        "Release Date",
        "Year_of_Release",
        "Year",
      ],
      age_rating: [
        "Release-Rating",
        "Rating",
        "classification",
        "Release-Rating",
        "esrb_rating",
        "required_age",
      ],
      price: ["Original Price", "price"],
      discounted_price: [
        "Metrics-UsedPrice",
        "Discounted Price",
        "discounted_price",
      ],
      metascore: [
        "Metrics-ReviewScore",
        "metacritic",
        "Metascore",
        "Critic_Score",
      ],
      user_score: [
        "User_Score",
        "website_rating",
        "Avg_Userscore",
        "user_rating",
        "public_rating",
        "user_review",
      ],
      website: ["website", "url"],
      description: [
        "short_description",
        "detailed_description",
        "Game Description",
        "summary",
      ],
      supported_languages: ["Supported Languages"],
      game_features: ["Features-MaxPlayers", "Game Features"],
      steam_tags: ["Popular Tags", "steamspy_tags"],
      achievements: ["achievements", "achievements_count"],
      reviews_count: ["reviews_count"],
      rating_top: ["rating_top"], // Me servirá por si quiero poner estrellas
    };
  }
}

export class ReviewHeaders {
  constructor() {
    this.headers = [
      { id: "game", title: "Game" }, // SLUG
      { id: "username", title: "Username" },
      { id: "review_text", title: "Review Text" },
      { id: "review_score", title: "Review Score" },
      { id: "review_votes", title: "Review Votes" },
      { id: "hours_played", title: "Hours Played" },
      { id: "recommendation", title: "Recommendation" },
      { id: "date", title: "Date" },
    ];
    this.columnMap = {
      game: ["slug"],
      username: ["Username", "username", "User", "user"],
      review_text: ["Review", "Review Text", "Review_Text", "Comment"],
      review_score: [
        "Score",
        "Review Score",
        "Review_Score",
        "Userscore",
        "website_rating",
      ],
      review_votes: ["Votes", "Review Votes", "Review_Votes", "helpful"],
      hours_played: ["hours_played", "Hours", "Hours Played", "Hours_Played"],
      recommendation: [
        "recommendation",
        "Recommendation",
        "Recommendation_Status",
      ],
      date: ["Date", "Review Date"],
    };
  }
}

export class SalesHeaders {
  constructor() {
    this.headers = [
      { id: "game", title: "Game" }, // SLUG
      { id: "na_sales", title: "NA Sales" },
      { id: "eu_sales", title: "EU Sales" },
      { id: "jp_sales", title: "JP Sales" },
      { id: "other_sales", title: "Other Sales" },
      { id: "global_sales", title: "Global Sales" },
    ];
    this.columnMap = {
      game: ["slug"],
      na_sales: ["NA_Sales", "NA Sales", "North America Sales"],
      eu_sales: ["EU_Sales", "EU Sales", "Europe Sales"],
      jp_sales: ["JP_Sales", "JP Sales", "Japan Sales"],
      other_sales: [
        "Other_Sales",
        "Other Sales",
        "Other Regions Sales",
        "Metrics-Sales",
      ],
      global_sales: ["Global_Sales", "Global Sales"],
    };
  }
}

export class RankingHeaders {
  constructor() {
    this.headers = [
      { id: "game", title: "Game" }, // SLUG
      { id: "rank_type", title: "Rank Type" },
      { id: "rank", title: "Rank" },
      { id: "category", title: "Category" },
      // { id: "studio", title: "Studio" },
      { id: "year", title: "Year" },
    ];
    this.columnMap = {
      game: ["game_name", "slug"],
      rank_type: ["rank_type", "Rank Type", "Rank_Type", "RankType"],
      rank: ["rank", "Rank", "Ranking", "Ranking_Position"],
      category: ["genre", "Category", "Genre", "category"],
      // studio: ["Studio", "Developer", "studio"],
      year: ["Year", "year"],
    };
  }
}

export class LongToBeatHeaders {
  constructor() {
    this.headers = [
      { id: "game", title: "Game" }, // SLUG
      { id: "all_playstyles", title: "All Playstyles" },
      { id: "completionists", title: "Completionists" },
      { id: "with_extras", title: "With Extras" },
      { id: "main_story", title: "Main Story" },
    ];
    this.columnMap = {
      game: ["slug"],
      all_playstyles: [
        "Length-AllPlayStyles-Average",
        "All Playstyles",
        "All Playstyles Average",
        "playtime",
      ], //th_game_info
      completionists: [
        "Length-Completionists-Average",
        "Completionists",
        "Completionists Average",
      ],
      with_extras: [
        "Length-MainExtras-Average",
        "With Extras",
        "With Extras Average",
      ],
      main_story: [
        "Length-MainStory-Average",
        "Main Story",
        "Main Story Average",
      ],
    };
  }
}

export class GameAwardsHeaders {
  constructor() {
    this.headers = [
      { id: "game", title: "Game" }, // SLUG
      { id: "year", title: "Year" },
      { id: "category", title: "Category" },
      { id: "winner", title: "Winner" },
    ];
  }
}
