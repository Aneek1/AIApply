import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

Font.register({
  family: 'Inter',
  fonts: [
    { src: '/fonts/Inter-Regular.ttf' },
    { src: '/fonts/Inter-Bold.ttf', fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: 'Inter',
    fontSize: 11,
    lineHeight: 1.6,
    color: '#1f2937',
  },
  header: {
    marginBottom: 30,
  },
  name: {
    fontSize: 20,
    fontWeight: 700,
    color: '#111827',
    marginBottom: 4,
  },
  contactInfo: {
    fontSize: 10,
    color: '#4b5563',
    lineHeight: 1.4,
  },
  date: {
    marginBottom: 20,
    fontSize: 11,
    color: '#374151',
  },
  recipient: {
    marginBottom: 30,
  },
  company: {
    fontWeight: 700,
    fontSize: 11,
    color: '#111827',
  },
  greeting: {
    marginBottom: 16,
    fontSize: 11,
    color: '#111827',
  },
  paragraph: {
    marginBottom: 12,
    textAlign: 'justify',
    lineHeight: 1.6,
  },
  closing: {
    marginTop: 24,
  },
  signature: {
    marginTop: 8,
    fontWeight: 700,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    right: 50,
    fontSize: 8,
    color: '#9ca3af',
    textAlign: 'center',
  },
});

export const CoverLetterPDF = ({ data }) => {
  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Sender Info */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.personalInfo.fullName}</Text>
          <View style={styles.contactInfo}>
            <Text>{data.personalInfo.city}, {data.personalInfo.state}</Text>
            <Text>{data.personalInfo.email}</Text>
            <Text>{data.personalInfo.phone}</Text>
          </View>
        </View>

        {/* Date */}
        <Text style={styles.date}>{formatDate()}</Text>

        {/* Recipient */}
        <View style={styles.recipient}>
          {data.recipient.name && <Text>{data.recipient.name}</Text>}
          {data.recipient.title && <Text>{data.recipient.title}</Text>}
          <Text style={styles.company}>{data.recipient.company}</Text>
        </View>

        {/* Content */}
        <Text style={styles.greeting}>{data.content.greeting}</Text>
        <Text style={styles.paragraph}>{data.content.opening}</Text>
        <Text style={styles.paragraph}>{data.content.body}</Text>
        <Text style={styles.paragraph}>{data.content.closing}</Text>

        <View style={styles.closing}>
          <Text>Sincerely,</Text>
          <Text style={styles.signature}>{data.personalInfo.fullName}</Text>
        </View>

        {data.metadata.isTailored && (
          <Text style={styles.footer}>
            Tailored for {data.recipient.company}
          </Text>
        )}
      </Page>
    </Document>
  );
};
