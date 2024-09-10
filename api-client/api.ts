import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

interface User {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface SpotifyAdd {
  uri?: string | null;
}

interface ManualAdd {
  title: string;
  artist: string;
  lyrics: string;
  uuid?: string | null;
}

interface WordAdd {
  word: string;
  title: string;
  artist: string;
  list_id?: string | null;
}

export interface SongData {
  lyrics: string[][];
  hiragana_lyrics: string;
  word_mapping: any; // Adjust the type based on the actual structure
  kanji_data: any; 
}

export class APIClient {
  private axiosInstance: AxiosInstance;

  constructor(token: string) {
    const config: AxiosRequestConfig = {
      baseURL: "https://hd83cf9mvd.execute-api.us-east-2.amazonaws.com/dev/",
    };

    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`,
      };
    }

    this.axiosInstance = axios.create(config);
  }

  // Auth endpoints
  public async getCurrentUser() {
    const response = await this.axiosInstance.get("/auth/current-user");
    return response.data;
  }

  public async createUser(input: User, password: string) {
    const response = await this.axiosInstance.post("/auth/create-user", {
      input,
      password,
    });
    return response.data;
  }

  public async getToken(username: string, password: string) {
    const response = await this.axiosInstance.post<TokenResponse>(
      "/auth/token",
      new URLSearchParams({
        grant_type: "password",
        username,
        password,
      })
    );
    return response.data;
  }

  // Song endpoints
  public async addSongSpot(spotifyData: SpotifyAdd) {
    const response = await this.axiosInstance.post("/song/add-song-spot", spotifyData);
    return response.data;
  }

  public async addSongManual(manualData: ManualAdd) {
    const response = await this.axiosInstance.post("/song/add-song-manual", manualData);
    return response.data;
  }

  public async getSongs() {
    const response = await this.axiosInstance.get("/song/get-songs");
    return response.data;
  }

  public async getGlobalSongs(limit: number = 10, offset: number = 0) {
    const response = await this.axiosInstance.get("/song/get-global-songs", {
      params: { limit, offset },
    });
    return response.data;
  }

  public async getSong(title: string, artist: string): Promise<SongData | { message: string }> {
    try {
      const response = await this.axiosInstance.get<SongData | { message: string }>("/song/get-song", {
        params: { title, artist },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching song:", error);
      return { message: "An error occurred while fetching the song." };
    }
  }

  // Lists endpoints
  public async getLists() {
    const response = await this.axiosInstance.get("/lists/get-lists");
    return response.data;
  }

  public async addList(listName: string, type: string) {
    const response = await this.axiosInstance.post("/lists/add-list", {
      list_name: listName,
      type,
    });
    return response.data;
  }

  public async deleteList(listId: string) {
    const response = await this.axiosInstance.delete("/lists/delete-list", {
      params: { list_id: listId },
    });
    return response.data;
  }

  public async addWordToList(wordData: WordAdd) {
    const response = await this.axiosInstance.post("/lists/add-word", wordData);
    return response.data;
  }
}
