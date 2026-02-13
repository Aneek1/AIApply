import { Upload, Zap, Download } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: Upload,
      title: 'Upload Your Resume',
      description: 'Simply upload your existing resume or create a new profile with your experience and skills.',
    },
    {
      icon: Zap,
      title: 'Paste Job Description',
      description: 'Copy and paste the job posting. Our AI analyzes requirements and optimizes your application.',
    },
    {
      icon: Download,
      title: 'Download & Apply',
      description: 'Get your tailored resume, cover letter, and ATS score. Export and apply with confidence.',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to transform your job applications
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-purple-300 to-blue-300" />
                )}

                <div className="relative bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 h-full">
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-white flex items-center justify-center text-xl font-bold shadow-lg">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className="mb-6 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-xl bg-white shadow-md flex items-center justify-center">
                      <Icon className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-3 text-center">{step.title}</h3>
                  <p className="text-muted-foreground text-center leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
