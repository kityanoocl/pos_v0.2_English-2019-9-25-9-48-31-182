'use strict';

function getItemDetail(barcode, allItemsList) {
    return allItemsList.find(item => item.barcode == barcode);
}

function decodeItemList(inputs) {
    const allItemsList = loadAllItems();
    return inputs.reduce(function (orderedItems, barcode) {
        let data = orderedItems.find(item => item.barcode == barcode);
        if (data) {
            data.quantity++;
        }
        else {
            let itemDetail = getItemDetail(barcode, allItemsList);
            orderedItems.push({
                barcode: itemDetail.barcode,
                name: itemDetail.name,
                unit: itemDetail.unit,
                unitPrice: itemDetail.price,
                quantity: 1
            });
        }
        return orderedItems;
    }, []);
}

function calculateSubTotalPrice(detailItemList) {
    return detailItemList.map(detailItem => {
        return {
            barcode: detailItem.barcode, name: detailItem.name, unit: detailItem.unit,
            unitPrice: detailItem.unitPrice, quantity: detailItem.quantity,
            subTotalPrice: detailItem.unitPrice * detailItem.quantity
        }
    });
}
function calculateTotalPrice(itemSubSummaryList) {
    let totalPrice = 0;
    itemSubSummaryList.forEach(detailItem => totalPrice += detailItem.subTotalPrice);
    return totalPrice;
}

function generateItemSummary(detailItemList) {
    let itemSubSummaryList = calculateSubTotalPrice(detailItemList);
    return { itemSubSummaryList: itemSubSummaryList, totalPrice: calculateTotalPrice(itemSubSummaryList) };
}

function formatItemSummary(itemSummary) {
    return "Name：" + itemSummary.name + "，Quantity：" + itemSummary.quantity + " " + ((itemSummary.quantity > 1) ? itemSummary.unit + "s" : itemSummary.unit)
        + "，Unit：" + itemSummary.unitPrice.toFixed(2) + " (yuan)，Subtotal：" + itemSummary.subTotalPrice.toFixed(2)
        + " (yuan)\n";
}

function formatReceipt(itemSummaryList) {
    let receiptString = "***<store earning no money>Receipt ***\n";
    itemSummaryList.itemSubSummaryList.forEach(itemSummary => {
        return receiptString += formatItemSummary(itemSummary);
    })
    receiptString += "----------------------\nTotal：" + itemSummaryList.totalPrice.toFixed(2) + " (yuan)\n**********************";
    return receiptString;
}

function printReceipt(inputs) {
    let detailItemList = decodeItemList(inputs);
    let itemSummaryList = generateItemSummary(detailItemList)
    console.log(formatReceipt(itemSummaryList));
}
