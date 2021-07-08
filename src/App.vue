<template>
  <v-app>
    <v-app-bar
      app
      dark
    >
      <span class="text-h5">Chat</span>
      <v-spacer></v-spacer>
      <v-btn @click="refresh">Trocar usuário<v-icon>refresh</v-icon></v-btn>
    </v-app-bar>
    <v-main class="pl-4 pr-4">
      <v-card v-if="!currentUser" max-width="500px" class="pa-4" elevation="12" style="margin: auto; margin-top: 50px">
        <v-card-title>Digite seu usuário</v-card-title>
        <v-card-text>
          <v-text-field outlined v-model="inputUser" label="Nome" @keyup.enter.prevent="createUser(inputUser)">
          </v-text-field>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn @click="createUser(inputUser)" class="" color="primary"> Entrar </v-btn>
        </v-card-actions>
      </v-card>
      <div v-if="currentUser && currentUser.id">
        <v-row>
          <v-col v-if="$vuetify.breakpoint.mdAndUp" cols="4">
            <v-card elevation="12" style="margin-top: 200px">
              <v-card-title>
                Sem autenticação, com conexão via Websocket utilizando GraphQl, Appsync e Amplify. Cria usuário e envia mensagens, que tem ttl de 10min
              </v-card-title>
            </v-card>
          </v-col>
          <v-col :cols="$vuetify.breakpoint.smAndDown ? '12' : '8'">
            <v-responsive :height="$vuetify.breakpoint.height - 180" style="overflow-y:auto" class="custom_scroll">
              <v-list-item v-for="(mess, index) in totalMessages" :key="index">
                <v-spacer v-if="mess.userId === userId"></v-spacer>
                <div :class="mess.userId === userId ? 'text-right light-green lighten-3' : 'text-left light-blue lighten-3'" class="mt-2 pa-3 rounded-lg">
                  <div v-if="mess.userId !== userId" class="subtitle-2 mt-n2 mb-1">{{Users.find(opt => opt.id === mess.userId).name}}</div>
                  <div>{{mess.content}}</div>
                </div>
              </v-list-item>
            </v-responsive>
            <v-textarea counter :rules="rulesMessages" v-model="inputMessage" auto-grow rows="2" hide-details outlined class="mt-8" @keypress.enter="send">
              <template v-slot:append-outer="">
                <v-icon @click="send">send</v-icon>
              </template>
            </v-textarea>
          </v-col>
        </v-row>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import { API } from "aws-amplify";
import { listUsers } from "./graphql/queries";
import { onCreateUser } from "./graphql/subscriptions";
import { listMessages } from "./graphql/queries";
import { onCreateMessage } from "./graphql/subscriptions";
import { createUser, createMessage } from "./graphql/mutations";

export default {
  name: 'App',

  components: {
  },

  data: () => ({
    //
    Users: null,
    inputUser: null,
    inputMessage: null,
    currentUser: null,
    messages: [],
  }),

  async created() {
    // users
    const usr = await API.graphql({
      query: listUsers
    })
    this.Users = usr.data.listUsers.items;

    API.graphql({ query: onCreateUser }).subscribe({
      next: (eventData) => {
        const user = eventData.value.data.onCreateUser;
        this.Users = [...this.Users, user];
      },
    });


    // messages
    const messagesRes = await API.graphql({
      query: listMessages,
    });
    this.messages = messagesRes.data.listMessages.items;
    API.graphql({ query: onCreateMessage }).subscribe({
      next: (eventData) => {
        const message = eventData.value.data.onCreateMessage;
        this.messages = [...this.messages, message];
      },
    });
  },

  computed: {
    rulesMessages () {
      return [v => v && v.length <= 100 || 'Max 100 characters']
    },

    totalMessages () {
      return this.messages.length > 20 ? this.sortMessages(this.messages).slice(this.messages.length - 20, this.messages.length) : this.sortMessages(this.messages)
    },

    userId () {
      return this.currentUser.id
    },

    content () {
      return this.inputMessage
    }
  },

  methods: {
    refresh () {
      window.location.reload
    },

    async send() {
      if (this.inputMessage && this.inputMessage.trim().length > 0) {
        const { content, userId } = this;
        const ttl = parseInt(new Date().setMinutes(new Date().getMinutes() + 10) / 1000);
        if (!content) return;
        const message = { content, userId, ttl };
        await API.graphql({
          query: createMessage,
          variables: { input: message },
        }).then(() => {
          this.inputMessage = null
        });
      }
      this.focusOnLastMessage()
    },

    focusOnLastMessage () {
      const elements = document.getElementsByClassName('v-list-item theme--light')
      if (elements.length > 10) {
        elements[elements.length - 1].scrollIntoView();
      }
    },

    sortMessages(values) {
      const result = [...values]
      return result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    },

    async createUser(name) {
      if (!name) return;
      const user = { name };
      const createUserRes = await API.graphql({
        query: createUser,
        variables: { input: user },
      });
      this.currentUser = createUserRes.data.createUser;
    },
  }
};
</script>
<style>
@import url("//fonts.googleapis.com/css?family=Roboto:400,500,700,400italic|Material+Icons");

.custom_scroll::-webkit-scrollbar {
  width: 10px;
}

/* Track */
.custom_scroll::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px grey;
  border-radius: 10px;
}

/* Handle */
.custom_scroll::-webkit-scrollbar-thumb {
  background: #cfcfcf;
  border-radius: 10px;
}
</style>
