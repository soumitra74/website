import { ArrowRight, Mail, Linkedin, MapPin, Calendar, Users, Award, Code, Database, Cloud, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="text-xl font-bold text-slate-900">Engineering Leader</div>
            <div className="hidden md:flex space-x-8">
              <a href="#about" className="text-slate-600 hover:text-slate-900 transition-colors">
                About
              </a>
              <a href="#experience" className="text-slate-600 hover:text-slate-900 transition-colors">
                Experience
              </a>
              <a href="#portfolio" className="text-slate-600 hover:text-slate-900 transition-colors">
                Portfolio
              </a>
              <a href="#expertise" className="text-slate-600 hover:text-slate-900 transition-colors">
                Expertise
              </a>
              <a href="#contact" className="text-slate-600 hover:text-slate-900 transition-colors">
                Contact
              </a>
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
                EL
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              Innovation-Driven
              <span className="block text-emerald-600">Engineering Leader</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              28 years of experience building scalable SaaS products, leading high-performing teams, and driving
              innovation across backend/frontend architectures, cloud computing, and DevOps processes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                <Mail className="w-4 h-4 mr-2" />
                Get In Touch
              </Button>
              <Button variant="outline" size="lg">
                <a href="#portfolio" className="flex items-center">
                  View Portfolio
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">About Me</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Forward-thinking engineering leader with deep expertise in building and scaling technology products
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Professional Journey</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                With 28 years of experience across various domains and scales of product development, I've established
                myself as an innovation-driven engineering leader. My expertise spans SaaS web applications, backend and
                frontend architectures, cloud computing, developer productivity, and DevOps processes.
              </p>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Recently completed a CTO program (executive education) from ISB, further strengthening my strategic and
                leadership capabilities. I've successfully grown and mentored high-performing teams at reputed
                organizations.
              </p>
              <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                <Award className="w-5 h-5" />
                CTO Program Graduate - ISB
              </div>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-emerald-600" />
                    Leadership Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">
                    Led engineering and data science teams at Entropik for two years, delivering two market-leading
                    products: Decode and Qatalyst.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-emerald-600" />
                    Innovation Focus
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">
                    Passionate about driving innovation through technology, with a proven track record of building
                    scalable solutions and fostering team growth.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Experience</h2>
            <p className="text-lg text-slate-600">Leadership roles at industry-leading organizations</p>
          </div>

          <div className="space-y-8">
            <Card className="border-l-4 border-l-emerald-500">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">Engineering & Data Science Leader</CardTitle>
                    <CardDescription className="text-lg font-semibold text-emerald-600">Entropik</CardDescription>
                  </div>
                  <Badge variant="secondary">2 Years</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">
                  Led engineering and data science teams, delivering two market-leading products:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="font-semibold">Decode</span> - Market leading product
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="font-semibold">Qatalyst</span> - Market leading product
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-emerald-500">
              <CardHeader>
                <CardTitle className="text-xl">Senior Engineering Roles</CardTitle>
                <CardDescription className="text-lg">Industry Leaders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <div className="font-bold text-lg text-slate-900">Intuit</div>
                    <p className="text-slate-600 text-sm">Financial Technology</p>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <div className="font-bold text-lg text-slate-900">PayU</div>
                    <p className="text-slate-600 text-sm">Payment Solutions</p>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <div className="font-bold text-lg text-slate-900">Razorpay</div>
                    <p className="text-slate-600 text-sm">Fintech Platform</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Product Portfolio</h2>
            <p className="text-lg text-slate-600">Market-leading products delivered under my engineering leadership</p>
          </div>

          <div className="space-y-16">
            {/* Decode Case Study */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="mb-6">
                  <Badge className="bg-emerald-100 text-emerald-800 mb-4">Consumer Insights Platform</Badge>
                  <h3 className="text-3xl font-bold text-slate-900 mb-4">Decode</h3>
                  <p className="text-xl text-slate-600 mb-6">
                    AI-powered consumer emotion and behavior analytics platform that revolutionized market research
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-2">Challenge</h4>
                    <p className="text-slate-600">
                      Traditional market research methods were time-consuming, expensive, and often provided limited
                      insights into consumer emotions and subconscious responses. Brands needed real-time, accurate
                      emotional analytics to make data-driven decisions.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-2">Solution</h4>
                    <p className="text-slate-600">
                      Led the development of an AI-powered platform that uses facial coding, eye tracking, and voice
                      analytics to decode consumer emotions in real-time. Built a scalable microservices architecture
                      supporting millions of data points.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-2">Key Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Python</Badge>
                      <Badge variant="outline">TensorFlow</Badge>
                      <Badge variant="outline">React</Badge>
                      <Badge variant="outline">Node.js</Badge>
                      <Badge variant="outline">AWS</Badge>
                      <Badge variant="outline">Docker</Badge>
                      <Badge variant="outline">Kubernetes</Badge>
                      <Badge variant="outline">PostgreSQL</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:order-first">
                <Card className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                        D
                      </div>
                      <h5 className="text-lg font-semibold text-slate-900">Impact & Results</h5>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="bg-white p-4 rounded-lg">
                        <div className="text-2xl font-bold text-emerald-600">500+</div>
                        <div className="text-sm text-slate-600">Enterprise Clients</div>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <div className="text-2xl font-bold text-emerald-600">10M+</div>
                        <div className="text-sm text-slate-600">Data Points/Day</div>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <div className="text-2xl font-bold text-emerald-600">99.9%</div>
                        <div className="text-sm text-slate-600">Uptime SLA</div>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <div className="text-2xl font-bold text-emerald-600">40%</div>
                        <div className="text-sm text-slate-600">Cost Reduction</div>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg">
                      <h6 className="font-semibold text-slate-900 mb-2">Leadership Achievements</h6>
                      <ul className="text-sm text-slate-600 space-y-1">
                        <li>• Scaled engineering team from 5 to 25 developers</li>
                        <li>• Reduced deployment time from 4 hours to 15 minutes</li>
                        <li>• Achieved 99.9% platform reliability</li>
                        <li>• Implemented ML pipeline processing 10M+ data points daily</li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <Separator className="my-16" />

            {/* Qatalyst Case Study */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="mb-6">
                  <Badge className="bg-purple-100 text-purple-800 mb-4">UX Research Platform</Badge>
                  <h3 className="text-3xl font-bold text-slate-900 mb-4">Qatalyst</h3>
                  <p className="text-xl text-slate-600 mb-6">
                    Comprehensive UX research platform enabling remote user testing and behavioral analytics at scale
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-2">Challenge</h4>
                    <p className="text-slate-600">
                      UX researchers struggled with fragmented tools, limited remote testing capabilities, and
                      difficulty in gathering comprehensive user insights. The need for a unified platform became
                      critical during the remote work shift.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-2">Solution</h4>
                    <p className="text-slate-600">
                      Architected and delivered a comprehensive UX research platform with integrated screen recording,
                      heatmaps, surveys, and AI-powered insights. Built for global scale with multi-tenant architecture.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-2">Key Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">React</Badge>
                      <Badge variant="outline">TypeScript</Badge>
                      <Badge variant="outline">Node.js</Badge>
                      <Badge variant="outline">WebRTC</Badge>
                      <Badge variant="outline">Redis</Badge>
                      <Badge variant="outline">MongoDB</Badge>
                      <Badge variant="outline">AWS</Badge>
                      <Badge variant="outline">Elasticsearch</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                        Q
                      </div>
                      <h5 className="text-lg font-semibold text-slate-900">Impact & Results</h5>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="bg-white p-4 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">300+</div>
                        <div className="text-sm text-slate-600">Global Brands</div>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">1M+</div>
                        <div className="text-sm text-slate-600">User Sessions</div>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">50+</div>
                        <div className="text-sm text-slate-600">Countries</div>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">60%</div>
                        <div className="text-sm text-slate-600">Time Savings</div>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg">
                      <h6 className="font-semibold text-slate-900 mb-2">Technical Achievements</h6>
                      <ul className="text-sm text-slate-600 space-y-1">
                        <li>• Built real-time video processing pipeline</li>
                        <li>• Implemented global CDN for low-latency delivery</li>
                        <li>• Achieved sub-second response times globally</li>
                        <li>• Designed auto-scaling infrastructure</li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Combined Impact */}
            <div className="bg-slate-50 rounded-2xl p-8 mt-16">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Combined Leadership Impact</h3>
                <p className="text-slate-600 max-w-3xl mx-auto">
                  Under my engineering leadership, both products achieved market-leading positions and significant
                  business impact
                </p>
              </div>

              <div className="grid md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-emerald-600 mb-2">800+</div>
                  <div className="text-slate-600">Total Enterprise Clients</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-emerald-600 mb-2">50+</div>
                  <div className="text-slate-600">Team Members Led</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-emerald-600 mb-2">$50M+</div>
                  <div className="text-slate-600">Revenue Impact</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-emerald-600 mb-2">99.9%</div>
                  <div className="text-slate-600">Platform Reliability</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section id="expertise" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Core Expertise</h2>
            <p className="text-lg text-slate-600">Deep technical knowledge across the full technology stack</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Code className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                <CardTitle>SaaS Web Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">Full-stack development and architecture of scalable SaaS platforms</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Database className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                <CardTitle>Backend Architecture</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">Designing robust, scalable backend systems and microservices</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Cloud className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                <CardTitle>Cloud Computing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">Cloud-native architectures and infrastructure optimization</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                <CardTitle>Team Leadership</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">Growing and mentoring high-performing engineering teams</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Zap className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                <CardTitle>Developer Productivity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">Optimizing development workflows and team efficiency</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Award className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                <CardTitle>DevOps Processes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">CI/CD pipelines, automation, and deployment strategies</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Let's Connect</h2>
          <p className="text-xl text-slate-300 mb-8">
            Ready to discuss your next engineering challenge or leadership opportunity?
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
              <Mail className="w-4 h-4 mr-2" />
              Send Email
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent"
            >
              <Linkedin className="w-4 h-4 mr-2" />
              LinkedIn Profile
            </Button>
          </div>

          <Separator className="bg-slate-700 mb-8" />

          <div className="flex justify-center items-center gap-6 text-slate-400">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Available for Remote & On-site</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Open to New Opportunities</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <p>&copy; 2024 Engineering Leader. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
} 