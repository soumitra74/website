import { ArrowRight, Mail, Linkedin, MapPin, Calendar, Users, Award, Code, Database, Cloud, Zap, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DynamicIcon } from "@/components/ui/dynamic-icon"
import { ThemeToggle } from "@/components/theme-toggle"
import { getContent, ContentData } from "@/lib/content"

export default async function HomePage() {
  const content: ContentData = await getContent()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="text-xl font-bold text-slate-900 dark:text-white transition-colors">
              {content.navigation.brand}
            </div>
            <div className="flex items-center space-x-8">
              <div className="hidden md:flex space-x-8">
                {content.navigation.links.map((link, index) => (
                  <a 
                    key={index}
                    href={link.href} 
                    className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                  >
                    {link.text}
                  </a>
                ))}
                <a 
                  href="/ask-me"
                  className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors font-medium"
                >
                  <MessageCircle className="w-4 h-4" />
                  Ask Me (beta)
                </a>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="mb-6">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-6">
                {content.hero.initials}
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 transition-colors">
              {content.hero.title.main}
              <span className="block text-emerald-600 dark:text-emerald-400">{content.hero.title.highlight}</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed transition-colors">
              {content.hero.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {content.hero.buttons.map((button, index) => (
                <Button 
                  key={index}
                  size="lg" 
                  className={button.variant === 'primary' ? 'bg-emerald-600 hover:bg-emerald-700' : 'border-slate-300 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800'}
                >
                  <DynamicIcon name={button.icon} className="w-4 h-4 mr-2" />
                  {button.href ? (
                    <a href={button.href} className="flex items-center">
                      {button.text}
                      {button.icon === 'ArrowRight' && <DynamicIcon name="ArrowRight" className="w-4 h-4 ml-2" />}
                    </a>
                  ) : (
                    button.text
                  )}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 transition-colors">{content.about.title}</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto transition-colors">
              {content.about.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 transition-colors">{content.about.content.journey.title}</h3>
              {content.about.content.journey.paragraphs.map((paragraph, index) => (
                <p key={index} className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed transition-colors">
                  {paragraph}
                </p>
              ))}
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold transition-colors">
                <DynamicIcon name={content.about.content.journey.achievement.icon} className="w-5 h-5" />
                {content.about.content.journey.achievement.text}
              </div>
            </div>

            <div className="space-y-6">
              {content.about.content.cards.map((card, index) => (
                <Card key={index} className="dark:bg-slate-800 dark:border-slate-700 transition-colors">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 dark:text-white transition-colors">
                      <DynamicIcon name={card.icon} className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      {card.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 dark:text-slate-300 transition-colors">
                      {card.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-800 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 transition-colors">{content.experience.title}</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 transition-colors">{content.experience.subtitle}</p>
          </div>

          <div className="space-y-8">
            {content.experience.roles.map((role, index) => (
              <Card key={index} className="border-l-4 border-l-emerald-500 dark:bg-slate-800 dark:border-slate-700 transition-colors">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl dark:text-white transition-colors">{role.title}</CardTitle>
                      <CardDescription className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 transition-colors">{role.company}</CardDescription>
                    </div>
                    {role.duration && <Badge variant="secondary" className="dark:bg-slate-700 dark:text-slate-300">{role.duration}</Badge>}
                  </div>
                </CardHeader>
                <CardContent>
                  {role.description && (
                    <p className="text-slate-600 dark:text-slate-300 mb-4 transition-colors">
                      {role.description}
                    </p>
                  )}
                  {role.products && (
                    <div className="grid md:grid-cols-2 gap-4">
                      {role.products.map((product, productIndex) => (
                        <div key={productIndex} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <span className="font-semibold dark:text-white transition-colors">{product.name}</span> - <span className="dark:text-slate-300 transition-colors">{product.description}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {role.companies && (
                    <div className="grid md:grid-cols-3 gap-6">
                      {role.companies.map((company, companyIndex) => (
                        <div key={companyIndex} className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg transition-colors">
                          <div className="font-bold text-lg text-slate-900 dark:text-white transition-colors">{company.name}</div>
                          <p className="text-slate-600 dark:text-slate-300 text-sm transition-colors">{company.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 transition-colors">{content.portfolio.title}</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 transition-colors">{content.portfolio.subtitle}</p>
          </div>

          <div className="space-y-16">
            {content.portfolio.projects.map((project, index) => (
              <div key={index}>
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <div className="mb-6">
                      <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400 mb-4 transition-colors">{project.type}</Badge>
                      <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 transition-colors">{project.name}</h3>
                      <p className="text-xl text-slate-600 dark:text-slate-300 mb-6 transition-colors">
                        {project.description}
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 transition-colors">Challenge</h4>
                        <p className="text-slate-600 dark:text-slate-300 transition-colors">
                          {project.challenge}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 transition-colors">Solution</h4>
                        <p className="text-slate-600 dark:text-slate-300 transition-colors">
                          {project.solution}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 transition-colors">Key Technologies</h4>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, techIndex) => (
                            <Badge key={techIndex} variant="outline" className="dark:border-slate-600 dark:text-slate-300 transition-colors">{tech}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={index % 2 === 0 ? "lg:order-first" : ""}>
                    <Card className={`p-6 bg-gradient-to-br ${index === 0 ? 'from-emerald-50 to-emerald-100 border-emerald-200 dark:from-emerald-900/20 dark:to-emerald-800/20 dark:border-emerald-700' : 'from-purple-50 to-purple-100 border-purple-200 dark:from-purple-900/20 dark:to-purple-800/20 dark:border-purple-700'} transition-colors`}>
                      <div className="space-y-6">
                        <div className="text-center">
                          <div className={`w-16 h-16 ${index === 0 ? 'bg-emerald-600' : 'bg-purple-600'} rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4`}>
                            {project.name.charAt(0)}
                          </div>
                          <h5 className="text-lg font-semibold text-slate-900 dark:text-white transition-colors">Impact & Results</h5>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-center">
                          {Object.entries(project.metrics).map(([key, value], metricIndex) => (
                            <div key={metricIndex} className="bg-white dark:bg-slate-800 p-4 rounded-lg transition-colors">
                              <div className={`text-2xl font-bold ${index === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-purple-600 dark:text-purple-400'} transition-colors`}>{value}</div>
                              <div className="text-sm text-slate-600 dark:text-slate-300 transition-colors">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                            </div>
                          ))}
                        </div>

                        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg transition-colors">
                          <h6 className="font-semibold text-slate-900 dark:text-white mb-2 transition-colors">Leadership Achievements</h6>
                          <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1 transition-colors">
                            {project.achievements.map((achievement, achievementIndex) => (
                              <li key={achievementIndex}>• {achievement}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
                {index < content.portfolio.projects.length - 1 && <Separator className="my-16 dark:bg-slate-700" />}
              </div>
            ))}

            {/* Combined Impact */}
            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-8 mt-16 transition-colors">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 transition-colors">{content.portfolio.combined_impact.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 max-w-3xl mx-auto transition-colors">
                  {content.portfolio.combined_impact.description}
                </p>
              </div>

              <div className="grid md:grid-cols-4 gap-6 text-center">
                {content.portfolio.combined_impact.metrics.map((metric, index) => (
                  <div key={index}>
                    <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2 transition-colors">{metric.value}</div>
                    <div className="text-slate-600 dark:text-slate-300 transition-colors">{metric.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section id="expertise" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 transition-colors">{content.expertise.title}</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 transition-colors">{content.expertise.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.expertise.areas.map((area, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all dark:bg-slate-800 dark:border-slate-700 dark:hover:shadow-slate-900/50">
                <CardHeader>
                  <DynamicIcon name={area.icon} className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto mb-4 transition-colors" />
                  <CardTitle className="dark:text-white transition-colors">{area.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-300 transition-colors">{area.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 dark:bg-slate-950 text-white transition-colors duration-300">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{content.contact.title}</h2>
          <p className="text-xl text-slate-300 dark:text-slate-400 mb-8 transition-colors">
            {content.contact.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {content.contact.buttons.map((button, index) => (
              <Button
                key={index}
                size="lg"
                className={button.variant === 'primary' ? 'bg-emerald-600 hover:bg-emerald-700' : 'border-slate-600 dark:border-slate-500 text-slate-300 dark:text-slate-400 hover:bg-slate-800 dark:hover:bg-slate-900 bg-transparent'}
              >
                <DynamicIcon name={button.icon} className="w-4 h-4 mr-2" />
                {button.text}
              </Button>
            ))}
          </div>

          <Separator className="bg-slate-700 dark:bg-slate-600 mb-8" />

          <div className="flex justify-center items-center gap-6 text-slate-400 dark:text-slate-500">
            {content.contact.status.map((status, index) => (
              <div key={index} className="flex items-center gap-2">
                <DynamicIcon name={status.icon} className="w-4 h-4" />
                <span>{status.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 dark:bg-black text-slate-400 dark:text-slate-500 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        <div className="max-w-6xl mx-auto text-center">
          <p>{content.footer.copyright}</p>
        </div>
      </footer>
    </div>
  )
} 