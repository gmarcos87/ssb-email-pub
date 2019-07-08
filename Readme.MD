# ssb-email-pub

![ssb email](https://user-images.githubusercontent.com/10773838/60816596-6c7c3800-a170-11e9-95c5-937e82f55a3d.jpg)

## Idea
The main idea is to create a distributed email system, with support for sneakernet and that is compatible with current mail services.

## The ingredients
On the server we have a website where you can link an alias to a public ssb address. On the same server there is an ssb pub and an smtp server. When you receive an email for pigeon@server-name, it searches which ssb address is associated with the pigeon alias and encrypts the content in a private message for that recipient.

## Outgoing Emails
One thing I miss programming is sending emails, but it's something similar to receiving them.

## View on clients
Currently the message is being formatted so that it can be seen as a regular message in the private section. But it could actually have its own specification and view, even export the messages as files compatible with standard email clients.

![email ssb2](https://user-images.githubusercontent.com/10773838/60816594-6c7c3800-a170-11e9-980f-6c5b632beef8.jpg)

## Proof of concept
This is a proof of concept, although it is functional it is completely unsafe and I do not recommend putting it into production as is.
