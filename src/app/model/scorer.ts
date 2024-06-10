export class Scorer {
  private _name: string;
  public get name(): string {
    return this._name;
  }
  public set name(value: string) {
    this._name = value;
  }
  private _goluriFinala: number;
  public get goluriFinala(): number {
    return this._goluriFinala;
  }
  public set goluriFinala(value: number) {
    this._goluriFinala = value;
  }
  private _totalGoluri: number;
  public get totalGoluri(): number {
    return this._totalGoluri;
  }
  public set totalGoluri(value: number) {
    this._totalGoluri = value;
  }

  constructor(name: string) {
    this.name = name;
    this.totalGoluri = 1;
    this.goluriFinala = 0;
  }
  equals(other: Scorer): boolean {
    return (
      this.name === other.name &&
      this.goluriFinala === other.goluriFinala &&
      this.totalGoluri === other.totalGoluri
    );
  }
  hashCode(): number {
    const hashString = this.name + this.goluriFinala + this.totalGoluri;
    let hash = 0;

    for (let i = 0; i < hashString.length; i++) {
      const char = hashString.charCodeAt(i);
      hash = (hash << 5) - hash + char;
    }

    return hash;
  }
}
