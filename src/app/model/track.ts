export class Track {
  id: number;

  desc: string = '';
  name: string = '';
  persons: string = '';
  type: number;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
