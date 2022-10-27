class User:
    """
    USER Object test for login
    """

    def __init__(self):
        """
        initial process
        """
        self.user = 'jhs'
        self.inner_data = dict()
        self.inner_data[self.user] = dict()

    def set_user(self, user):
        self.user = user
        self.__allocate()

    def set_inner_data(self, key, value):
        self.inner_data[self.user][key] = value
        print(self.inner_data)

    def __allocate(self):
        data = self.inner_data.get(self.user)
        self.inner_data[self.user] = data if data is not None else dict()


user = User()