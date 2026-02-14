let connected = false;
let radioGroup = 123;
let message = "";
basic.showIcon(IconNames.Sad);
radio.setGroup(radioGroup);


input.onButtonPressed(Button.AB, function() {
    initConnection();
})

input.onButtonPressed(Button.A, function() {
    radioGroup--;
    radio.setGroup(radioGroup);
    basic.showNumber(radioGroup);
})

input.onButtonPressed(Button.B, function () {
    radioGroup++;
    radio.setGroup(radioGroup);
    basic.showNumber(radioGroup);
})

radio.onReceivedString(function(receivedString: string) {
    if (connected) {
        if (receivedString == "start")
        {
            message = "";
        }
        else if (receivedString == "end")
        {
            serial.writeString(message);
            message = "";
        }
        else{
            message += receivedString;
        }
    }
})

function initConnection(): void {
    pins.setPull(1, PinPullMode.PullUp);
    pins.setPull(8, PinPullMode.PullUp);
    serial.redirect(
        SerialPin.P1,
        SerialPin.P8,
        BaudRate.BaudRate115200
    )

    basic.pause(50);
    serial.writeString("command;")
    basic.pause(500);
}

serial.onDataReceived(";", () => {
    let received = serial.readString();
    if (received == "ok;" || received.substr(0, 7) == "Already") {
        connected = true;
        basic.showIcon(IconNames.Happy);
    }
    else
    {
        sendString(received);
    }
});

function sendString(message: string) {
    let length = message.length;
    radio.sendString("start");

    do {
        if (length <= 20) {
            radio.sendString(message);
            length = 0;
        }
        else {
            radio.sendString(message.substr(0, 19));
            message = message.substr(19);
            length -= 19;
        }
    } while (length > 0)

    radio.sendString("end");
}