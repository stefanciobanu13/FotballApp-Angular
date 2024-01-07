export class Scorer {
  name: string;
  goluriFinala: number;
  totalGoluri: number;

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
