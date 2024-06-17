export class NotifyAuctionsService {
  static async notifyClosedAuctions(
    closedAuctions,
    notificationService
  ) {
    for (let i = 0; i < closedAuctions.length; i++) {
      const auction = closedAuctions[i];
      if (this.#isUnboughtAuction(auction)) {
        await this.#sendUnboughtAuctionNotification(
          auction,
          notificationService
        );
        break;
      }

      await Promise.all([
        this.#notifySeller(notificationService),
        this.#notifyBuyer(notificationService),
      ]);
    }
  }

  static #isUnboughtAuction(auction) {
    return auction === 0;
  }

  static async #sendUnboughtAuctionNotification(
    auction,
    notificationService
  ) {
    const { title, seller } = auction;

    return notificationService.send({
      subject: "Your item hasn't been sold.",
      destinations: [seller.email],
      message: `We sorry, but your item ${title} hasn't registered any bids.`,
    });
  }
  static async #notifySeller(auction, notificationService) {
    const { title, seller } = auction;

    return notificationService.send({
      subject: "Your item has been sold!",
      destinations: [seller.email],
      message: `Congratulations, your item ${title} has been sold for $${amount}.`,
    });
  }
  static async #notifyBuyer(auction, notificationService) {
    const {
      title,
      highestBid: { bidder, amount },
    } = auction;

    return notificationService.send({
      destinations: [bidder.email],
      subject: `You has won an auction!`,
      message: `What a great deal! You got yourself a ${title} for $${amount}.`,
    });
  }
}
