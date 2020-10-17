export class Trainer {
  readonly trainer_id: string;
  readonly email: string;
  readonly name: string;
  readonly age: number;
  readonly gender: string;
  readonly address: string;
  readonly bio: string;
  readonly category: string;
  readonly profession: string;
  readonly mobile: string;
  readonly fc_rating: number;
  readonly images: string[];
  readonly min_cost: number;
  readonly geometry: IGeometry;

  constructor({
    trainer_id = "",
    email,
    name,
    age,
    gender,
    address,
    bio,
    category,
    profession,
    mobile,
    fc_rating,
    images,
    min_cost,
    geometry,
  }: ITrainer) {
    this.trainer_id = trainer_id;
    this.email = email;
    this.name = name;
    this.age = age;
    this.gender = gender;
    this.address = address;
    this.bio = bio;
    this.category = category;
    this.profession = profession;
    this.mobile = mobile;
    this.fc_rating = fc_rating;
    this.images = images;
    this.min_cost = min_cost;
    this.geometry = geometry;
  }

  hydrate() {
    return {
      trainerId: this.trainer_id,
      email: this.email,
      name: this.name,
      age: this.age,
      gender: this.gender,
      address: this.address,
      bio: this.bio,
      category: this.category,
      profession: this.profession,
      mobile: this.mobile,
      images: this.images,
      fcRating: this.fc_rating,
      minCost: this.min_cost,
      geometry: this.geometry,
    };
  }
}

export interface ITrainer {
  trainer_id?: string;
  email: string;
  name: string;
  age: number;
  gender: string;
  address: string;
  bio: string;
  category: string;
  profession: string;
  mobile: string;
  fc_rating: number;
  images: string[];
  min_cost: number;
  geometry: IGeometry;
}

interface IGeometry {
  geometry_id: string;
  lat: number;
  lon: number;
  description: string;
}
