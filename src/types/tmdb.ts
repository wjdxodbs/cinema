/** 미디어 종류 구분값 (영화/TV) */
export type MediaType = "movie" | "tv";

/** 장르 정보 */
export interface Genre {
  id: number;
  name: string;
}

/** 제작사 정보 */
export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

/** 사용 언어 정보 */
export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

/** 영화/TV 공통 필드 */
export interface Media {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  genre_ids?: number[];
  genres?: Genre[];
  vote_average: number;
  vote_count: number;
  popularity: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: MediaType;
  adult: boolean;
}

/** 영화 상세 정보 */
export interface Movie extends Media {
  title: string;
  original_title: string;
  release_date: string;
  runtime?: number;
  revenue?: number;
  budget?: number;
  status?: string;
  tagline?: string;
  production_companies?: ProductionCompany[];
  spoken_languages?: SpokenLanguage[];
}

/** TV 프로그램 상세 정보 */
export interface TvShow extends Media {
  name: string;
  original_name: string;
  first_air_date: string;
  number_of_episodes?: number;
  number_of_seasons?: number;
  episode_run_time?: number[];
  status?: string;
  tagline?: string;
  in_production?: boolean;
  production_companies?: ProductionCompany[];
  spoken_languages?: SpokenLanguage[];
}

/** 페이지네이션 응답 공통 타입 */
export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

/** 출연진(배우) 정보 */
export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

/** 제작진 정보 */
export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

/** 크레딧 응답 (출연진/제작진) */
export interface Credits {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
}

/** 영상(예고편/클립) 정보 */
export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
}

/** 영상 목록 응답 타입 */
export interface VideosResponse {
  id: number;
  results: Video[];
}

/** 트렌딩 API 응답 타입 */
export type TrendingResponse = PaginatedResponse<Media>;

/** 찜 목록에 저장되는 아이템 타입 */
export interface WatchlistItem {
  id: number;
  media_type: MediaType;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
  overview: string;
  backdrop_path: string | null;
  genre_ids?: number[];
  added_at: string;
}
