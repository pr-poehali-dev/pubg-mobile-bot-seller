import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Icon from '@/components/ui/icon';

const ucPackages = [
  { id: 1, uc: 60, price: 75, bonus: 0, popular: false },
  { id: 2, uc: 325, price: 375, bonus: 25, popular: true },
  { id: 3, uc: 660, price: 750, bonus: 60, popular: false },
  { id: 4, uc: 1800, price: 1875, bonus: 300, popular: false },
  { id: 5, uc: 3850, price: 3750, bonus: 850, popular: false },
];

const paymentMethods = [
  { id: 1, name: 'Банковская карта', icon: 'CreditCard', desc: 'Visa, MasterCard, МИР' },
  { id: 2, name: 'СБП', icon: 'Smartphone', desc: 'Система быстрых платежей' },
  { id: 3, name: 'Электронные кошельки', icon: 'Wallet', desc: 'ЮMoney, QIWI' },
  { id: 4, name: 'Криптовалюта', icon: 'Bitcoin', desc: 'BTC, ETH, USDT' },
];

const faqItems = [
  { q: 'Как быстро приходит UC?', a: 'UC зачисляется мгновенно после оплаты, обычно это занимает 1-5 минут.' },
  { q: 'Безопасна ли покупка?', a: 'Да, мы используем официальные методы пополнения. Ваш аккаунт в безопасности.' },
  { q: 'Нужен ли пароль от аккаунта?', a: 'Нет! Для пополнения достаточно только вашего Player ID.' },
  { q: 'Что делать если UC не пришел?', a: 'Свяжитесь с поддержкой через Telegram или WhatsApp - мы решим проблему в течение 15 минут.' },
  { q: 'Есть ли гарантия?', a: 'Да, мы даем 100% гарантию на все покупки. Если возникнет проблема - вернем деньги.' },
];

const Index = () => {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <header className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Icon name="Coins" size={48} className="text-primary" />
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              UC Store
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">Быстрое и безопасное пополнение UC для PUBG Mobile</p>
        </header>

        <Tabs defaultValue="catalog" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-card">
            <TabsTrigger value="catalog" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="ShoppingBag" size={20} className="mr-2" />
              Каталог
            </TabsTrigger>
            <TabsTrigger value="payment" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="CreditCard" size={20} className="mr-2" />
              Оплата
            </TabsTrigger>
            <TabsTrigger value="support" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="MessageCircle" size={20} className="mr-2" />
              Поддержка
            </TabsTrigger>
          </TabsList>

          <TabsContent value="catalog" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ucPackages.map((pkg) => (
                <Card
                  key={pkg.id}
                  className={`relative cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/20 ${
                    selectedPackage === pkg.id ? 'ring-2 ring-primary' : ''
                  } ${pkg.popular ? 'border-primary border-2' : ''}`}
                  onClick={() => setSelectedPackage(pkg.id)}
                >
                  {pkg.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-secondary-foreground font-bold">
                      🔥 ПОПУЛЯРНО
                    </Badge>
                  )}
                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <Icon name="Coins" size={40} className="text-white" />
                      </div>
                    </div>
                    <CardTitle className="text-3xl font-bold">{pkg.uc} UC</CardTitle>
                    {pkg.bonus > 0 && (
                      <CardDescription className="text-secondary font-semibold">
                        +{pkg.bonus} UC бонус!
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <div className="text-4xl font-bold text-primary">{pkg.price} ₽</div>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-lg py-6" size="lg">
                      <Icon name="ShoppingCart" size={20} className="mr-2" />
                      Купить
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Gift" size={24} className="text-primary" />
                  Преимущества покупки
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <Icon name="Zap" size={24} className="text-secondary flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Моментально</h4>
                    <p className="text-sm text-muted-foreground">UC приходит за 1-5 минут</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="Shield" size={24} className="text-secondary flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Безопасно</h4>
                    <p className="text-sm text-muted-foreground">100% официальный метод</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="HeadphonesIcon" size={24} className="text-secondary flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Поддержка 24/7</h4>
                    <p className="text-sm text-muted-foreground">Всегда на связи</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment" className="space-y-6 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Wallet" size={24} className="text-primary" />
                  Способы оплаты
                </CardTitle>
                <CardDescription>Выберите удобный способ оплаты</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                {paymentMethods.map((method) => (
                  <Card key={method.id} className="hover:border-primary transition-colors cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-lg">
                        <Icon name={method.icon as any} size={24} className="text-primary" />
                        {method.name}
                      </CardTitle>
                      <CardDescription>{method.desc}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="List" size={24} className="text-primary" />
                  Как оплатить
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Выберите пакет UC</h4>
                    <p className="text-sm text-muted-foreground">
                      Перейдите во вкладку "Каталог" и выберите нужное количество UC
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Введите Player ID</h4>
                    <p className="text-sm text-muted-foreground">
                      Укажите ваш игровой ID из PUBG Mobile (находится в настройках профиля)
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Оплатите заказ</h4>
                    <p className="text-sm text-muted-foreground">
                      Выберите удобный способ оплаты и завершите покупку
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold flex-shrink-0">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Получите UC</h4>
                    <p className="text-sm text-muted-foreground">
                      UC автоматически зачислятся на ваш аккаунт в течение 1-5 минут
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support" className="space-y-6 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="MessageCircleQuestion" size={24} className="text-primary" />
                  Часто задаваемые вопросы
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((item, idx) => (
                    <AccordionItem key={idx} value={`item-${idx}`}>
                      <AccordionTrigger className="text-left hover:text-primary">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/20 to-secondary/20 border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="HeadphonesIcon" size={24} className="text-primary" />
                  Служба поддержки
                </CardTitle>
                <CardDescription>Мы всегда на связи и готовы помочь!</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full bg-[#0088cc] hover:bg-[#0088cc]/90 text-lg py-6" size="lg">
                  <Icon name="Send" size={20} className="mr-2" />
                  Написать в Telegram
                </Button>
                <Button className="w-full bg-[#25D366] hover:bg-[#25D366]/90 text-lg py-6" size="lg">
                  <Icon name="MessageCircle" size={20} className="mr-2" />
                  Написать в WhatsApp
                </Button>
                <div className="text-center pt-4 space-y-2">
                  <p className="text-sm text-muted-foreground">Время ответа: обычно до 15 минут</p>
                  <p className="text-sm text-muted-foreground">Работаем 24/7 без выходных</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <footer className="text-center mt-16 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">© 2024 UC Store. Все права защищены.</p>
          <p className="text-xs text-muted-foreground mt-2">
            Мы не являемся официальными представителями PUBG Mobile
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
