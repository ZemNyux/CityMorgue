export class Product {
    constructor(data) {
        Object.assign(this, data)
    }

    get displayPrice() {
        return `$${this.price.toFixed(2)}`
    }

    get label() {
        return this.name
    }
}

export class DigitalProduct extends Product {
    get label() {
        return `${this.name} / DIGITAL`
    }
}

export class MerchProduct extends Product {
    get label() {
        return `${this.name} / MERCH`
    }
}

export class Category {
    constructor(id, name, count = 0) {
        this.id = id;
        this.name = name;
        this.count = count
    }
}

export class Cart {
    constructor(items = []) {
        this.items = items
    }

    get total() {
        return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    }

    get count() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0)
    }
}

export class Order {
    constructor(customer, items, total) {
        this.id = `CM-${Date.now().toString(36).toUpperCase()}`
        this.customer = customer
        this.items = items
        this.total = total
        this.createdAt = new Date().toISOString()
        this.status = 'received'
    }
}
