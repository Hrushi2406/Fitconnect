export class Trainer {
  readonly trainerId: string;
  readonly email: string;
  readonly name: string;
  readonly age: number;
  readonly gender: string;
  readonly address: string;
  readonly bio: string;
  readonly category: string;
  readonly profession: string;
  readonly mobile: string;
  readonly fcRating: number;
  readonly images: string[];
  readonly startPrice: number;
  readonly geometry: IGeometry;

  constructor({
    trainerId = "",
    email,
    name,
    age,
    gender,
    address,
    bio,
    category,
    profession,
    mobile,
    fcRating,
    images,
    startPrice,
    geometry,
  }: ITrainer) {
    this.trainerId = trainerId;
    this.email = email;
    this.name = name;
    this.age = age;
    this.gender = gender;
    this.address = address;
    this.bio = bio;
    this.category = category;
    this.profession = profession;
    this.mobile = mobile;
    this.fcRating = fcRating;
    this.images = images;
    this.startPrice = startPrice;
    this.geometry = geometry;
  }

  hydrate() {
    return {
      trainerId: this.trainerId,
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
      fcRating: this.fcRating,
      startPrice: this.startPrice,
      geometry: this.geometry,
    };
  }
}

export interface ITrainer {
  trainerId?: string;
  email: string;
  name: string;
  age: number;
  gender: string;
  address: string;
  bio: string;
  category: string;
  profession: string;
  mobile: string;
  fcRating: number;
  images: string[];
  startPrice: number;
  geometry: IGeometry;
}

interface IGeometry {
  geometryId: string;
  lat: number;
  lon: number;
  description: string;
}
