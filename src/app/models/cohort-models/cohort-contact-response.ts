export class ContactResponse {
    private _contactCount: number
    private _synopsis: string
    private _totalCount: number

    get contactCount() {
        return this._contactCount;
    }

    set contactCount(value: number) {
        this._contactCount = value;
    }

    get synopsis() {
        return this._synopsis;
    }

    set synopsis(value: string) {
        this._synopsis = value;
    }

    get totalCount() {
        return this._totalCount
    }

    set totalCount(value: number) {
        this._totalCount = value;
    }
}