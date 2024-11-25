interface GuestInfo {
    firstName: string;
    lastName: string;
    email: string;
}

interface PayloadInput {
    offerId: string;
    guestInfo: GuestInfo;
}

export const buildHotelBookingPayload = ({
    offerId,
    guestInfo,
}: PayloadInput) => {
    const { firstName, lastName, email } = guestInfo;

    return {
        data: {
            type: "hotel-order",
            guests: [
                {
                    tid: 1,
                    title: "MR",
                    firstName,
                    lastName,
                    phone: "+33679278416",
                    email,
                },
            ],
            travelAgent: {
                contact: {
                    email: "support@ota.com",
                },
            },
            roomAssociations: [
                {
                    guestReferences: [{ guestReference: "1" }],
                    hotelOfferId: offerId,
                },
            ],
            payment: {
                method: "CREDIT_CARD",
                paymentCard: {
                    paymentCardInfo: {
                        vendorCode: "VI",
                        cardNumber: "4151289722471370",
                        expiryDate: "2026-08",
                        holderName: `${firstName} ${lastName}`, // Construct holderName here
                    },
                },
            },
        },
    };
};
